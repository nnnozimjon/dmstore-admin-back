/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from 'express';

import { ValidatorController } from '@controllers/(general)/validator-controller';
import {
  Status200,
  Status400,
  StatusServerError,
} from '@generics/HttpStatuses';
import { uploadImage } from '@generics/uploadImage';
import { Merchant } from '@models/merchant-model';

export class AdminMerchantController {
  static async getAll(req: Request, res: Response) {
  }

  static async getById(req: Request, res: Response) {}

  static async create(req: Request, res: Response) {
    try {
      const dataImage: any = req.files;
      const storeImage = dataImage?.storeImage;
      const headerImage = dataImage?.headerImage;

      let store_image = '';
      let header_image = '';

      const { store_name, description, city_id, active } = req.body;

      const requiredParams = {
        store_name,
        description,
        city_id,
        active,
      };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res);
      }

      const storeImageUpload = await uploadImage(storeImage, 'merchants');

      if (storeImageUpload != null) {
        store_image = storeImageUpload[0];
      }

      const storeHeaderImageUpload = await uploadImage(
        headerImage,
        'merchants'
      );

      if (storeHeaderImageUpload != null) {
        header_image = storeHeaderImageUpload[0];
      }

      await Merchant.create({
        store_name,
        description,
        header_image,
        store_image,
        city_id,
        active,
      });

      Status200(res, 'Магазин успешно создан!');
    } catch (error) {
      StatusServerError(res);
    }
  }

  static async update(req: Request, res: Response) {}
  static async delete(req: Request, res: Response) {}
}
