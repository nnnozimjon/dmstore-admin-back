import { Request, Response } from 'express';
import { Status200, Status400, StatusServerError } from 'generics/HttpStatuses';
import { uploadImage } from 'generics/uploadImage';

import { ValidatorController } from '@controllers/validator-controller';
import { Products } from '@models/product-model';

export class MerchantProductController {
  static async getById() { }
  static async getAll() { }

  static async create(req: Request, res: Response) {
    try {
      const data: any = req.files;
      const user = (req as any).user;

      const created_by = user.id;

      const images = data.images;

      const {
        name,
        service_type,
        price, //number
        price_in_friday, //number
        discount, //number
        description,
        category_id,
        feature_id,
        brand_id,
        model_id,
        colors,
        qty, // number
        condition,
        shipping,
        year, //number
        vincode,
        rooms,
        status,
      } = req.body;

      const requiredParams = {
        created_by,
        images,
        name,
        service_type,
        price,
        description,
        category_id,
      };

      if (!images) {
        return Status400(res);
      }

      // Quantity || qty
      if (qty) {
        if ((qty !== null && Number(qty) <= 0) || isNaN(Number(qty))) {
          return Status400(res, 'Количество должно быть числом больше нуля.');
        }
      }

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        Status400(res);
      }

      // Price , not null
      if ((price !== null && Number(price) <= 0) || isNaN(Number(price))) {
        return Status400(res, 'Цена должно быть числом больше нуля.');
      }

      // price_in_friday

      if (price_in_friday) {
        if (
          (price_in_friday !== null && Number(price_in_friday) <= 0) ||
          isNaN(Number(price_in_friday)) ||
          Number(price_in_friday) > Number(price)
        ) {
          return Status400(
            res,
            'Пятничная цена должно быть числом больше нуля и меньше обычный цена.'
          );
        }
      }

      const imageNames = await uploadImage(images, 'products');
      const commaSeparatedString: string | undefined = imageNames?.join(',');

      await Products.create({
        created_by,
        images: commaSeparatedString,
        name,
        service_type,
        price,
        price_in_friday,
        discount,
        description,
        category_id,
        feature_id,
        brand_id,
        model_id,
        colors,
        qty,
        condition,
        shipping,
        year,
        vincode,
        rooms,
        status,
      });

      Status200(res, null);
    } catch (error) {
      console.log(error);
      StatusServerError(res);
    }
  }

  static async update() { }

  static async delete() { }
}
