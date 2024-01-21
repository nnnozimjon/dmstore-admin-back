import { Request, Response } from 'express';
import { deleteById } from 'generics/deleteById';
import { getById as TgetById } from 'generics/getById';

import { ValidatorController } from '@controllers/validator-controller';
import { Models } from '@models/index';

export class ModelController {
  static async getAll(req: Request, res: Response) {
    try {
      const pageSize = Number.parseInt(req.body.pageSize, 10) || 10;
      const pageNumber = Number.parseInt(req.body.pageNumber, 10) || 1;
      const offset = (pageNumber - 1) * pageSize;
      const { count, rows: categories } = await Models.findAndCountAll({
        limit: pageSize,
        offset,
      });
      const totalPages = Math.ceil(count / pageSize);
      res.status(200).json({
        payload: categories,
        total_page: totalPages,
        pageNumber,
        total_count: count,
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        error,
        message: 'Что-то пошло не так!',
      });
    }
  }

  static async getById(req: Request, res: Response) {
    await TgetById(Models, req, res);
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, brand_id } = req.body;
      const validation = ValidatorController.validateRequiredFields({
        name,
        brand_id,
      });
      // Check validation result
      if (!validation.valid) {
        return res.status(400).json({
          message: validation.error,
          code: 400,
        });
      }
      // Create the category
      await Models.create({ name, brand_id });
      res.status(200).json({
        code: 200,
      });
    } catch (error: any) {
      console.error('Error creating category:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          code: 400,
          message: 'Category with the same name already exists.',
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

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, brand_id } = req.body;
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
      const existingCategory = await Models.findByPk(id);
      if (!existingCategory) {
        return res.status(404).json({
          code: 404,
          message: 'Model not found.',
        });
      }
      await existingCategory.update({
        name,
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
    await deleteById(Models, req, res);
  }
}
