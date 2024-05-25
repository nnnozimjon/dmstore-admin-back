import express from 'express';
import multer from 'multer';

import { Controllers } from '@controllers/index';
import { authenticateTokenMerchant } from '@generics/authenticatToken';
import { otpRateLimit } from '@generics/otpRateLimit';
import { ApiPaths } from '@utils/api-paths';

const upload = multer();

export const MerchantRouter = express.Router();

MerchantRouter.post(
  ApiPaths.merchantRegister,
  Controllers.AuthController.registerMerchant
);

MerchantRouter.post(
  ApiPaths.merchantLogin,
  [otpRateLimit],
  Controllers.AuthController.signInMerchant
);

// category
MerchantRouter.get(
  ApiPaths.merchantCategory,
  [authenticateTokenMerchant],
  Controllers.MerchantCategoryController.getAll
); // no idea of usage

// product
MerchantRouter.get(
  ApiPaths.merchantProduct + '/:id',
  [authenticateTokenMerchant],
  Controllers.MerchantProductController.getById
);

MerchantRouter.get(
  ApiPaths.merchantProduct,
  [authenticateTokenMerchant],
  Controllers.MerchantProductController.getAll
);

MerchantRouter.post(
  ApiPaths.merchantProduct,
  [authenticateTokenMerchant, upload.fields([{ name: 'images' }])],
  Controllers.MerchantProductController.create
);

MerchantRouter.put(
  ApiPaths.merchantProduct + '/:id',
  Controllers.MerchantProductController.update
);

MerchantRouter.delete(
  ApiPaths.merchantProduct + '/:id',
  [authenticateTokenMerchant],
  Controllers.MerchantProductController.deleteById
);

MerchantRouter.post(
  ApiPaths.merchantOtp,
  [otpRateLimit],
  Controllers.otpController.generateAndSendOTP
); // no idea of usage
