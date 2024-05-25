import { Request, Response } from 'express';
import { create as TCreate } from 'generics/create';
import { deleteById } from 'generics/deleteById';
import { getAll as TGetAll } from 'generics/getAll';
import { getById as TgetById } from 'generics/getById';

import { ValidatorController } from '@controllers/(general)/validator-controller';
import { Brand } from '@models/brand-model';

export class BrandController {
  static async getAll(req: Request, res: Response) {
    await TGetAll(Brand, req, res, []);
  }

  static async getById(req: Request, res: Response) {
    await TgetById(Brand, req, res);
  }

  static async create(req: Request, res: Response) {
    await TCreate(
      Brand,
      req,
      res,
      ['name', 'category_id'],
      ['name', 'category_id']
    );
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

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

      const existingCategory = await Brand.findByPk(id);
      if (!existingCategory) {
        return res.status(404).json({
          code: 404,
          message: 'Brand not found.',
        });
      }
      await existingCategory.update({ name, updated_at: new Date() });
      res.status(200).json({ payload: existingCategory });
    } catch (error: any) {
      console.error('Error updating brand:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
          code: 400,
          message: 'Brand with the same name already exists.',
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
    await deleteById(Brand, req, res);
  }
}
