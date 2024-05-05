import express from 'express';
import { authenticateTokenMerchant } from 'generics/authenticatToken';
import { otpRateLimit } from 'generics/otpRateLimit';
import multer from 'multer';

import { Controllers } from '@controllers/index';
import { authenticateTokenClient } from '@generics/authenticateTokenClient';
import { ApiPaths } from '@utils/api-paths';

const upload = multer();

const Router = express.Router();

// ///////////////////////////////////////////////////////////////////////////////
//                                                                              //
//                                Login - user                                  //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////

Router.post(ApiPaths.register, Controllers.AuthController.register);
Router.post(ApiPaths.login, [otpRateLimit], Controllers.AuthController.signIn);

Router.post(
  ApiPaths.sendOtpToRegister,
  [otpRateLimit],
  Controllers.AuthController.sendOtpToRegister
);

Router.post(
  ApiPaths.sendOtpToRegister + '/verify',
  [otpRateLimit],
  Controllers.AuthController.verifyOtpRegister
);

Router.post(
  ApiPaths.isUserAvailable,
  Controllers.AuthController.isUserAvailable
);

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
//                                Admin - API                                   //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////

// categories
Router.get(ApiPaths.category, Controllers.CategoryController.getAll);
Router.get(ApiPaths.category + '/:id', Controllers.CategoryController.getById);
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

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
//                                Front - API                                   //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////

Router.get(
  ApiPaths.frontProduct,
  Controllers.FrontProductController.getByPagination
);

Router.get(
  ApiPaths.frontProduct + '/:id',
  Controllers.FrontProductController.getById
);

Router.get(
  ApiPaths.frontCategory,
  Controllers.CategoryController.getAllWithoutPagination
);

Router.get(
  ApiPaths.frontProduct + '/image/:image',
  Controllers.ImageController.productImage
);

Router.get(ApiPaths.frontWidget, Controllers.WidgetsController.getAll);

Router.get(
  ApiPaths.frontWidget + '/image/:image',
  Controllers.ImageController.widgetImage
);

// client order

Router.post(
  ApiPaths.frontOrderProduct,
  [authenticateTokenClient],
  Controllers.OrdersController.create
);

Router.get(
  ApiPaths.frontOrderProduct,
  [authenticateTokenClient],
  Controllers.OrdersController.getAll
);

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
//                                Merchant - API                                //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////

// category
Router.get(
  ApiPaths.merchantCategory,
  [authenticateTokenMerchant],
  Controllers.MerchantCategoryController.getAll
);

// product
Router.get(
  ApiPaths.merchantProduct + '/:id',
  [authenticateTokenMerchant],
  Controllers.MerchantProductController.getById
);

Router.get(
  ApiPaths.merchantProduct,
  [authenticateTokenMerchant],
  Controllers.MerchantProductController.getAll
);

Router.post(
  ApiPaths.merchantProduct,
  [authenticateTokenMerchant, upload.fields([{ name: 'images' }])],
  Controllers.MerchantProductController.create
);

Router.put(
  ApiPaths.merchantProduct,
  Controllers.MerchantProductController.update
);

Router.delete(
  ApiPaths.merchantProduct + '/:id',
  [authenticateTokenMerchant],
  Controllers.MerchantProductController.deleteById
);

Router.post(
  ApiPaths.merchantOtp,
  [otpRateLimit],
  Controllers.otpController.generateAndSendOTP
);

export default Router;
