import { Request, Response } from 'express';
import { create as TCreate } from 'generics/create';
import { deleteById } from 'generics/deleteById';
import { getAll as TGetAll } from 'generics/getAll';
import { getById as TgetById } from 'generics/getById';

import { ValidatorController } from '@controllers/(general)/validator-controller';
import { Category } from '@models/category-model';

export class CategoryController {
  static async getAll(req: Request, res: Response) {
    await TGetAll(Category, req, res, []);
  }

  static async getAllWithoutPagination(req: Request, res: Response) {
    try {
      const categories = await Category.findAll({
        where: { parent_id: null },
        include: {
          model: Category,
          as: 'sub',
          attributes: ['id', 'name'],
          required: false,
        },
        attributes: ['id', 'name'],
      });

      res.status(200).send(categories);
    } catch (error) {
      res.status(500).json({
        code: 500,
        error,
        message: 'Что-то пошло не так!',
      });
    }
  }

  static async getById(req: Request, res: Response) {
    await TgetById(Category, req, res);
  }

  static async create(req: Request, res: Response) {
    await TCreate(Category, req, res, ['name', 'parent_id'], ['name']);
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, parent_id } = req.body;
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
      const existingCategory = await Category.findByPk(id);
      if (!existingCategory) {
        return res.status(404).json({
          code: 404,
          message: 'Category not found.',
        });
      }
      await existingCategory.update({
        name,
        parent_id,
        updated_at: new Date(),
      });
      res.status(200).json({ payload: existingCategory });
    } catch (error: any) {
      console.error('Error updating category:', error);
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

  static async delete(req: Request, res: Response) {
    await deleteById(Category, req, res);
  }
}
