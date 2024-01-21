import express from 'express';

import { CategoryController } from '@controllers/category-controller';
import { Controllers } from '@controllers/index';
import { ApiPaths } from '@utils/api-paths';

const Router = express.Router();

// CRUD for All Tables

// categories
Router.get(ApiPaths.category, Controllers.CategoryController.getAll);
Router.get(ApiPaths.category + '/:id', CategoryController.getById);
Router.post(ApiPaths.category, Controllers.CategoryController.create);
Router.put(ApiPaths.category + '/:id', Controllers.CategoryController.update);

Router.delete(
  ApiPaths.category + '/:id',
  Controllers.CategoryController.delete
);

// brands
Router.get(ApiPaths.brand, Controllers.BrandController.getAll);
Router.get(ApiPaths.brand + '/:id', Controllers.BrandController.getById);
Router.post(ApiPaths.brand, Controllers.BrandController.create);
Router.put(ApiPaths.brand + '/:id', Controllers.BrandController.update);
Router.delete(ApiPaths.brand + '/:id', Controllers.BrandController.delete);

// models
Router.get(ApiPaths.model, Controllers.ModelController.getAll);
Router.get(ApiPaths.model + '/:id', Controllers.ModelController.getById);
Router.post(ApiPaths.model, Controllers.ModelController.create);
Router.put(ApiPaths.model + '/:id', Controllers.ModelController.update);
Router.delete(ApiPaths.model + '/:id', Controllers.ModelController.delete);

// products
Router.get(ApiPaths.product, Controllers.ProductController.getAll);
Router.get(ApiPaths.product + '/:id', Controllers.ProductController.getById);
Router.post(ApiPaths.product, Controllers.ProductController.create);
Router.put(ApiPaths.product + '/:id', Controllers.ProductController.update);
Router.delete(ApiPaths.product + '/:id', Controllers.ProductController.delete);

export default Router;
