import { Request, Response } from 'express';

import { Status200, StatusServerError } from '@generics/HttpStatuses';
import { Cities } from '@models/cities-model';
import { Merchant } from '@models/merchant-model';
import { UserStores } from '@models/user-stores-model';

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
          storeImage: store?.Merchant?.store_image,
          city: store?.Merchant?.City?.value,
        };
      });

      Status200(res, null, {
        code: 200,
        payload: mappedStores,
      });
    } catch (error) {
      StatusServerError(res);
    }
  }
}
