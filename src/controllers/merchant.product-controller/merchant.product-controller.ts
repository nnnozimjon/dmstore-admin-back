import { Request, Response } from 'express';
import { ServerErrorLog } from 'generics/ServerErrorLog';

import { ValidatorController } from '@controllers/validator-controller';
import { Products } from '@models/product-model';
import { uploadImage } from 'generics/uploadImage';

export class MerchantProductController {
  static async getAll() { }

  static async create(req: Request, res: Response) {
    try {
      const images = req.files;
      const user = (req as any).user;
      const created_by = user.id;

      console.log(images);
      uploadImage

      const {
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

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return res.json({
          code: 400,
          message: validation.error,
        });
      }

      const newProduct = await Products.create({
        created_by,
        images,
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

      res.json({
        code: 200,
        payload: newProduct,
      });
    } catch (error) {
      ServerErrorLog(res);
    }
  }

  static async update() { }

  static async delete() { }
}
