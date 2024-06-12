import express from 'express';
import multer from 'multer';

import { Controllers } from '@controllers/index';
import { authenticateTokenAdmin } from '@generics/authenticateTokenAdmin';
import { ApiPaths } from '@utils/api-paths';

const upload = multer();

export const AdminRouter = express.Router();

AdminRouter.get(
  ApiPaths.users,
  [authenticateTokenAdmin],
  Controllers.UsersController.getAll
);

AdminRouter.post(
  ApiPaths.users,
  [authenticateTokenAdmin],
  Controllers.UsersController.create
);
AdminRouter.post(
  ApiPaths.merchants,
  [
    authenticateTokenAdmin,
    upload.fields([{ name: 'storeImage' }, { name: 'headerImage' }]),
  ],
  Controllers.AdminMerchantController.create
);

AdminRouter.get(
  ApiPaths.merchants,
  [authenticateTokenAdmin],
  Controllers.AdminMerchantController.getAll
);

// categories
AdminRouter.get(
  ApiPaths.category,
  [authenticateTokenAdmin],
  Controllers.CategoryController.getAllWithoutPagination
);
AdminRouter.get(
  ApiPaths.category + '/:id',
  [authenticateTokenAdmin],
  Controllers.CategoryController.getById
);
AdminRouter.post(
  ApiPaths.category,
  [authenticateTokenAdmin],
  Controllers.CategoryController.create
);
AdminRouter.put(
  ApiPaths.category + '/:id',
  [authenticateTokenAdmin],
  Controllers.CategoryController.update
);

AdminRouter.delete(
  ApiPaths.category + '/:id',
  [authenticateTokenAdmin],
  Controllers.CategoryController.delete
);

// brands
AdminRouter.get(
  ApiPaths.brand,
  [authenticateTokenAdmin],
  Controllers.BrandController.getAll
);
AdminRouter.get(
  ApiPaths.brand + '/:id',
  [authenticateTokenAdmin],
  Controllers.BrandController.getById
);
AdminRouter.post(ApiPaths.brand, Controllers.BrandController.create);
AdminRouter.put(
  ApiPaths.brand + '/:id',
  [authenticateTokenAdmin],
  Controllers.BrandController.update
);
AdminRouter.delete(
  ApiPaths.brand + '/:id',
  [authenticateTokenAdmin],
  Controllers.BrandController.delete
);

// products
AdminRouter.get(
  ApiPaths.product,
  [authenticateTokenAdmin],
  Controllers.ProductController.getAll
);
AdminRouter.get(
  ApiPaths.product + '/:id',
  [authenticateTokenAdmin],
  Controllers.ProductController.getById
);
AdminRouter.post(
  ApiPaths.product,
  [authenticateTokenAdmin],
  Controllers.ProductController.create
);
AdminRouter.put(
  ApiPaths.product + '/:id',
  [authenticateTokenAdmin],
  Controllers.ProductController.update
);
AdminRouter.delete(
  ApiPaths.product + '/:id',
  [authenticateTokenAdmin],
  Controllers.ProductController.delete
);

// widgets
AdminRouter.get(
  ApiPaths.widgets,
  [authenticateTokenAdmin],
  Controllers.AdminWidgetsController.getAll
);

// payments
AdminRouter.get(
  ApiPaths.payments,
  [authenticateTokenAdmin],
  Controllers.AdminPaymentsController.getAll
);
AdminRouter.post(
  ApiPaths.payments,
  [authenticateTokenAdmin, upload.single('image')],
  Controllers.AdminPaymentsController.create
);
