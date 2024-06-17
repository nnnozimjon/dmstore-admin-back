import { Request, Response } from 'express';

import { Status200, StatusServerError } from '@generics/HttpStatuses';
import { Category } from '@models/category-model';

interface CategoryWithSubcategories {
  id: number;
  name: string;
  subCategories: CategoryWithSubcategories[];
}

export class FrontCategoryController {
  static async getAll(req: Request, res: Response) {
    try {
      const categories = await Category.findAll({
        where: {
          is_active: 1,
        },
      });
      
      const categoriesWithSubcategories: CategoryWithSubcategories[] = [];

      // Filter root categories (where parent_id is null)
      const rootCategories = categories.filter(
        (category) => category.parent_id === null
      );

      // Recursively build category tree
      const buildCategoryTree = (
        parentCategory: Category
      ): CategoryWithSubcategories => {
        const categoryNode: CategoryWithSubcategories = {
          id: parentCategory.id,
          name: parentCategory.name,
          subCategories: [],
        };

        const subcategories = categories.filter(
          (category) => category.parent_id === parentCategory.id
        );

        subcategories.forEach((subcategory) => {
          categoryNode.subCategories.push(buildCategoryTree(subcategory));
        });

        return categoryNode;
      };

      // Build category tree for each root category
      rootCategories.forEach((rootCategory) => {
        categoriesWithSubcategories.push(buildCategoryTree(rootCategory));
      });

      Status200(res, '', { payload: categoriesWithSubcategories });
    } catch (error) {
      StatusServerError(res);
    }
  }
}
