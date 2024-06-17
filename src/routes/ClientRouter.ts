import express from 'express';

import { Controllers } from '@controllers/index';
import { authenticateTokenClient } from '@generics/authenticateTokenClient';
import { otpRateLimit } from '@generics/otpRateLimit';
import { ApiPaths } from '@utils/api-paths';

export const ClientRouter = express.Router();

ClientRouter.post(ApiPaths.register, Controllers.AuthController.register);

ClientRouter.post(
  ApiPaths.login,
  [otpRateLimit],
  Controllers.AuthController.signIn
);
ClientRouter.post(
  ApiPaths.sendOtpToRegister,
  [otpRateLimit],
  Controllers.AuthController.sendOtpToRegister
);

ClientRouter.post(
  ApiPaths.sendOtpToRegister + '/verify',
  [otpRateLimit],
  Controllers.AuthController.verifyOtpRegister
);

ClientRouter.post(
  ApiPaths.isUserAvailable,
  Controllers.AuthController.isUserAvailable
);

ClientRouter.get(
  ApiPaths.frontProduct,
  Controllers.FrontProductController.getByPagination
);

ClientRouter.get(
  ApiPaths.frontProduct + '/:id',
  Controllers.FrontProductController.getById
);

ClientRouter.get(
  ApiPaths.frontProduct + '/image/:image',
  Controllers.ImageController.productImage
);

ClientRouter.get(ApiPaths.frontWidget, Controllers.WidgetsController.getAll);

ClientRouter.get(
  ApiPaths.frontWidget + '/image/:image',
  Controllers.ImageController.widgetImage
);

// client order

ClientRouter.post(
  ApiPaths.frontOrderProduct,
  [authenticateTokenClient],
  Controllers.OrdersController.create
);

ClientRouter.get(
  ApiPaths.frontOrderProduct,
  [authenticateTokenClient],
  Controllers.OrdersController.getAll
);

ClientRouter.post(
  ApiPaths.frontProduct + '/search',
  Controllers.FrontProductController.searchProduct
);

ClientRouter.get(
  ApiPaths.frontCategory,
  Controllers.FrontCategoryController.getAll
);
