import { Request, Response } from 'express';
import { create as TCreate } from 'generics/create';
import { deleteById } from 'generics/deleteById';
import { getAll as TGetAll } from 'generics/getAll';
import { Status200, Status400, StatusServerError } from 'generics/HttpStatuses';

import { ValidatorController } from '@controllers/validator-controller';
import { Products } from '@models/index';
import { baseUrl, frontApi } from '@utils/api-paths';

export class ProductController {
  static async getAll(req: Request, res: Response) {
    await TGetAll(Products, req, res, []);
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Check if the ID is provided
      if (!id) {
        return Status400(res);
      }
      // Convert the ID to a number
      const itemId = Number.parseInt(id, 10);
      // Check if the ID is a valid number
      if (isNaN(itemId)) {
        return Status400(res);
      }
      // Find the item by ID
      const item = await Products.findOne({
        where: {
          id: itemId,
          status: 'active',
        },
      });
      // Check if the item exists
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      const images = item.images.split(',').map((url) => {
        return baseUrl + frontApi + '/product/image/' + url;
      });

      Status200(res, null, {
        payload: {
          id: item.id,
          created_by: item.id,
          images,
          name: item.name,
          price: item.price,
          description: item.description,
          discount: item.discount,
          qty: item.qty,
          shipping: item.shipping,
        },
      });
    } catch (error) {
      console.error('Error fetching item:', error);
      StatusServerError(res);
    }
  }

  static async create(req: Request, res: Response) {
    await TCreate(
      Products,
      req,
      res,
      ['name', 'description', 'category_id', 'brand_id', 'model_id'],
      ['name', 'description', 'category_id']
    );
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, category_id, brand_id, model_id } = req.body;
      const validation = ValidatorController.validateRequiredFields({
        id,
        name,
      });
      if (!validation.valid) {
        return res.status(400).json({
          message: validation.error,
          code: 400,
        });
      }
      const existingCategory = await Products.findByPk(id);
      if (!existingCategory) {
        return res.status(404).json({
          code: 404,
          message: 'Model not found.',
        });
      }
      await existingCategory.update({
        name,
        description,
        category_id,
        model_id,
        brand_id,
        updated_at: new Date(),
      });
      res.status(200).json({ payload: existingCategory });
    } catch (error: any) {
      console.error('Error updating model:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          code: 400,
          message: 'Model with the same name already exists.',
        });
      } else {
        res.status(500).json({
          code: 500,
          error,
          message: 'Что-то пошло не так!',
        });
      }
    }
  }

  static async delete(req: Request, res: Response) {
    await deleteById(Products, req, res);
  }
}
