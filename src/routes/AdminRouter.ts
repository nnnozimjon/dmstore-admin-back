import express from 'express';
import multer from 'multer';

import { Controllers } from '@controllers/index';
import { ApiPaths } from '@utils/api-paths';

const upload = multer();

export const AdminRouter = express.Router();

AdminRouter.post(ApiPaths.createUser, Controllers.UsersController.create);
AdminRouter.post(
  ApiPaths.createMerchant,
  [upload.fields([{ name: 'storeImage' }, { name: 'headerImage' }])],
  Controllers.AdminMerchantController.create
);

// categories
AdminRouter.get(ApiPaths.category, Controllers.CategoryController.getAll);
AdminRouter.get(
  ApiPaths.category + '/:id',
  Controllers.CategoryController.getById
);
AdminRouter.post(ApiPaths.category, Controllers.CategoryController.create);
AdminRouter.put(
  ApiPaths.category + '/:id',
  Controllers.CategoryController.update
);

AdminRouter.delete(
  ApiPaths.category + '/:id',
  Controllers.CategoryController.delete
);

// brands
AdminRouter.get(ApiPaths.brand, Controllers.BrandController.getAll);
AdminRouter.get(ApiPaths.brand + '/:id', Controllers.BrandController.getById);
AdminRouter.post(ApiPaths.brand, Controllers.BrandController.create);
AdminRouter.put(ApiPaths.brand + '/:id', Controllers.BrandController.update);
AdminRouter.delete(ApiPaths.brand + '/:id', Controllers.BrandController.delete);

// products
AdminRouter.get(ApiPaths.product, Controllers.ProductController.getAll);
AdminRouter.get(
  ApiPaths.product + '/:id',
  Controllers.ProductController.getById
);
AdminRouter.post(ApiPaths.product, Controllers.ProductController.create);
AdminRouter.put(
  ApiPaths.product + '/:id',
  Controllers.ProductController.update
);
AdminRouter.delete(
  ApiPaths.product + '/:id',
  Controllers.ProductController.delete
);
