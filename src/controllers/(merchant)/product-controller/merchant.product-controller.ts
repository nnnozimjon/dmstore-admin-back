/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/prefer-number-properties */
/* eslint-disable sonarjs/no-collapsible-if */
import { Request, Response } from 'express';
import fs from 'fs';
import { Status200, Status400, StatusServerError } from 'generics/HttpStatuses';
import { uploadImage } from 'generics/uploadImage';
import path from 'path';
import { literal } from 'sequelize';

import { ValidatorController } from '@controllers/(general)/validator-controller';
import { Merchant } from '@models/merchant-model';
import { Products } from '@models/product-model';
import { UserStores } from '@models/user-stores-model';
import { baseUrl, frontApi } from '@utils/api-paths';

const url = baseUrl + frontApi + '/product/image/';

export class MerchantProductController {
  static async getById(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const user_id = user.id;

      const id = req.params.Id;
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

      const productInfo = await Products.findOne({
        where: {
          id,
          created_by: store_id,
          status: ['active', 'review'],
        },
        attributes: [
          'id',
          'name',
          'price',
          'description',
          'qty',
          'shipping',
          'category_id',
          'sub_category_id',
          [
            literal(
              `CONCAT(:baseUrl, REPLACE(images, ",",CONCAT(',',:baseUrl)))`
            ),
            'images',
          ],
        ],
        replacements: { baseUrl: url },
      });

      if (!productInfo) {
        return res
          .status(404)
          .json({ code: 404, message: 'Продукт не найден!' });
      }

      const payload = {
        payload: productInfo,
      };

      Status200(res, '', payload);
    } catch (error) {
      console.log(error);
      return StatusServerError(res);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const user_id = user.id;
      const store_id = req.params.id;
      const { pageNumber = 1, pageSize = 20 } = req.query;

      const requiredParams = { store_id };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res);
      }

      const store = await UserStores.findOne({ where: { user_id, store_id } });

      if (!store) {
        return Status400(res, 'Магазин пользователя не найден!');
      }

      const totalCount = await Products.count({
        where: {
          created_by: store_id,
          status: ['active', 'review'],
        },
        include: [
          {
            model: Merchant,
            attributes: ['store_name', 'id'],
            required: true,
            as: 'Merchant',
          },
        ],
      });

      const products = await Products.findAll({
        offset: (Number(pageNumber) - 1) * Number(pageSize),
        where: {
          created_by: store_id,
          status: ['active', 'review'],
        },
        order: [['id', 'DESC']],
        attributes: [
          'id',
          'name',
          'status',
          [
            literal(
              `CONCAT(:baseUrl, REPLACE(images, ",",CONCAT(',',:baseUrl)))`
            ),
            'images',
          ],
        ],
        replacements: { baseUrl: url },
        limit: Number(pageSize),
      });

      const totalPages = Math.ceil(Number(totalCount) / Number(pageSize));

      Status200(res, '', { payload: products, totalPages });
    } catch (error) {
      console.log(error);
      return StatusServerError(res);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data: any = req.files;
      const user = (req as any).user;

      const user_id = user.id;

      const images = data.images;

      const {
        name,
        price,
        discount,
        description,
        category_id,
        sub_category_id,
        brand_id,
        qty,
        shipping,
        store_id,
      } = req.body;

      const requiredParams = {
        store_id,
        images,
        name,
        price,
        description,
        category_id,
      };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res);
      }

      if (images?.length === 0) {
        return Status400(res);
      }

      if (qty) {
        if ((qty !== null && Number(qty) <= 0) || isNaN(Number(qty))) {
          return Status400(res, 'Количество должно быть числом больше нуля.');
        }
      }

      if ((price !== null && Number(price) <= 0) || isNaN(Number(price))) {
        return Status400(res, 'Цена должно быть числом больше нуля.');
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

      const imageNames = await uploadImage(images, 'products');
      const commaSeparatedString: string | undefined = imageNames?.join(',');

      await Products.create({
        created_by: store_id,
        images: commaSeparatedString,
        name,
        price,
        ...(Number(discount) && { discount }),
        ...(Number(sub_category_id) && { sub_category_id }),
        description,
        category_id,
        ...(Number(brand_id) && { brand_id }),
        ...(Number(qty) && { qty }),
        ...(shipping ? { shipping } : { shipping: 'free' }),
        status: 'review',
      });

      return Status200(res);
    } catch (error) {
      console.log(error);
      return StatusServerError(res);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, price, description, qty, shipping, images } = req.body;
      const user = (req as any).user;
      const created_by = user.id;

      // Validate id
      if (!id) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      // Find product by ID
      const product = await Products.findOne({
        where: {
          created_by,
          id,
        },
      });

      // Check if product exists
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Update product data
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.qty = qty || product.qty;
      product.shipping = shipping || product.shipping;

      // Update images if provided
      if (images) {
        // Delete old images from server
        const oldImages = product.images.split(',');
        oldImages.forEach((image) => {
          const imagePath = path.join(
            __dirname,
            '..',
            '..',
            'assets',
            'products',
            image
          );
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });

        // Save new images to server
        const newImages = images.split(',');
        product.images = newImages.join(',');
      }

      // Save updated product data to database
      await product.save();

      // Respond with success message
      return res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error(error);
      // Log error and send 500 status for server errors
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async deleteById(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const user_id = user.id;
      const store_id = req.params.id;
      const product_id = req.params.productId;

      const requiredParams = { store_id };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res);
      }

      const store = await UserStores.findOne({ where: { user_id, store_id } });

      if (!store) {
        return Status400(res, 'Магазин пользователя не найден!');
      }

      const product = await Products.findOne({
        where: {
          id: product_id,
          created_by: store_id,
          status: 'active',
        },
      });

      if (!product) {
        return res.status(404).json({ message: 'Продукт не найден!' });
      }

      product.update(
        { status: 'deleted' },
        {
          where: {
            id: product_id,
            created_by: store_id,
            status: 'active',
          },
        }
      );

      Status200(res);
    } catch (error) {
      console.log(error);
      return StatusServerError(res);
    }
  }
}
