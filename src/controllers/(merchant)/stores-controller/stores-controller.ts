import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

import { ValidatorController } from '@controllers/(general)/validator-controller';
import {
  Status200,
  Status400,
  StatusServerError,
} from '@generics/HttpStatuses';
import { uploadImage } from '@generics/uploadImage';
import { Cities } from '@models/cities-model';
import { Merchant } from '@models/merchant-model';
import { UserStores } from '@models/user-stores-model';
import { Users } from '@models/users-model';
import { baseUrl, merchantApi } from '@utils/api-paths';

const url = baseUrl + merchantApi + '/stores/image/';

export class MerchantStoreController {
  static async getAll(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const user_id = user.id;

      const stores = await UserStores.findAll({
        where: {
          user_id,
        },
        include: [
          {
            model: Merchant,
            attributes: ['id', 'store_name', 'store_image'],
            include: [
              {
                model: Cities,
                attributes: ['value'],
              },
            ],
          },
        ],
      });

      const mappedStores = stores.map((store: any) => {
        return {
          storeId: store?.Merchant?.id,
          storeName: store?.Merchant?.store_name,
          storeImage: store?.Merchant?.store_image
            ? url + store?.Merchant?.store_image
            : null,
          city: store?.Merchant?.City?.value,
        };
      });

      Status200(res, null, {
        payload: mappedStores,
      });
    } catch (error) {
      StatusServerError(res);
    }
  }

  static async getStoreInfo(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const user_id = user.id;
      const store_id = req.params.storeId;

      if (!store_id) {
        return Status400(res);
      }

      const store = await UserStores.findOne({
        where: {
          user_id,
          store_id,
        },
      });

      if (!store) {
        return Status400(res, 'Магазин пользователя не найден!');
      }

      const storeInfo: any = await UserStores.findOne({
        where: {
          store_id,
          user_id,
        },
        include: [
          {
            model: Merchant,
            attributes: ['id', 'store_name', 'description', 'store_image'],
            include: [
              {
                model: Cities,
                attributes: ['value'],
              },
            ],
          },
        ],
      });

      const sortedValue = {
        storeName: storeInfo?.Merchant?.store_name,
        storeDescription: storeInfo?.Merchant?.description,
        storeImage: storeInfo?.Merchant?.store_image
          ? url + storeInfo?.Merchant?.store_image
          : null,
        cityName: storeInfo?.Merchant?.City?.value,
      };

      Status200(res, null, {
        payload: sortedValue,
      });
    } catch (error) {
      StatusServerError(res);
    }
  }

  static async updateStoreInfo(req: Request, res: Response) {
    try {
      const file = req.file;
      const user = (req as any).user;
      const user_id = user.id;
      const store_id = req.params.storeId;

      const {
        storeName,
        storeDescription,
        deleteImage,
        //  cityId
      } = req.body;

      const requiredParams = {
        storeName,
        storeDescription,
        // cityId
      };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res);
      }

      if (!store_id) {
        return Status400(res);
      }

      const store = await UserStores.findOne({
        where: {
          user_id,
          store_id,
        },
      });

      if (!store) {
        return Status400(res, 'Магазин пользователя не найден!');
      }

      let imageName = null;

      if (file) {
        const imageNames = await uploadImage([file], 'merchants');

        if (imageNames !== null) {
          imageName = imageNames[0];
        }
      }

      if (deleteImage) {
        const imagePath = path.join(
          __dirname,
          '../../../assets/merchants',
          deleteImage
        );

        fs.access(imagePath, fs.constants.F_OK, (err) => {
          if (err) {
            return res.status(404).json({ message: 'Изображение не найдено!' });
          }

          fs.unlink(imagePath, (err) => {
            if (err) {
              return StatusServerError(res);
            }
            imageName = null;
          });
        });
      }

      await Merchant.update(
        {
          store_name: storeName,
          description: storeDescription,
          ...(imageName && { store_image: imageName }),
          ...(deleteImage && { store_image: imageName }),
        },
        {
          where: {
            id: store_id,
          },
        }
      );

      Status200(res);
    } catch (error) {
      StatusServerError(res);
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const user_id = user.id;

      const { prevPassword, newPassword } = req.body;

      const requiredParams = { prevPassword, newPassword };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res);
      }

      const requester = await Users.findOne({
        where: {
          id: user_id,
        },
      });

      const email = requester?.email;

      if (email === undefined) {
        return res
          .status(404)
          .json({ code: 404, message: 'Пользователь не найден' });
      }

      const isUserCredentialCorrect =
        await ValidatorController.isMerchantCredentialCorrect(
          res,
          email,
          prevPassword
        );

      if (!isUserCredentialCorrect) {
        return res.status(404).json({
          code: 404,
          message: 'Неправильный пароль, попробуйте еще раз!',
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await Users.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            email,
          },
        }
      );

      Status200(res);
    } catch (error) {
      StatusServerError(res);
    }
  }
}
