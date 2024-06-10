import express from 'express';
import multer from 'multer';

import { MerchantStoreController } from '@controllers/(merchant)/stores-controller';
import { Controllers } from '@controllers/index';
import { authenticateTokenMerchant } from '@generics/authenticatToken';
import { otpRateLimit } from '@generics/otpRateLimit';
import { ApiPaths } from '@utils/api-paths';

const upload = multer();

export const MerchantRouter = express.Router();

MerchantRouter.post(
  ApiPaths.merchantLogin,
  [otpRateLimit],
  Controllers.MerchantAuthController.signInMerchant
);

MerchantRouter.get(
  ApiPaths.merchantStores,
  [authenticateTokenMerchant],
  Controllers.MerchantStoreController.getAll
);

MerchantRouter.get(
  ApiPaths.merchantStores + '/store/:storeId',
  [authenticateTokenMerchant],
  MerchantStoreController.getStoreInfo
);

MerchantRouter.put(
  ApiPaths.merchantStores + '/change-password',
  [authenticateTokenMerchant],
  MerchantStoreController.changePassword
);

MerchantRouter.put(
  ApiPaths.merchantStores + '/store/:storeId',
  [authenticateTokenMerchant, upload.single('storeImage')],
  MerchantStoreController.updateStoreInfo
);

MerchantRouter.get(
  ApiPaths.merchantStores + '/image/:image',
  Controllers.ImageController.storeImage
);

// category
MerchantRouter.get(
  ApiPaths.merchantCategory,
  [authenticateTokenMerchant],
  Controllers.MerchantCategoryController.getAll
); // no idea of usage

// product
MerchantRouter.get(
  ApiPaths.merchantProduct + '/store/:storeId/product/:Id',
  [authenticateTokenMerchant],
  Controllers.MerchantProductController.getById
);

MerchantRouter.get(
  ApiPaths.merchantProduct + '/store/:id',
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
  ApiPaths.merchantProduct + '/store/:id/product/:productId',
  [authenticateTokenMerchant],
  Controllers.MerchantProductController.deleteById
);

MerchantRouter.post(
  ApiPaths.merchantOtp,
  [otpRateLimit],
  Controllers.otpController.generateAndSendOTP
); // no idea of usage

// orders

MerchantRouter.get(
  ApiPaths.merchantOrders + '/store/:storeId/status/:statusId',
  [authenticateTokenMerchant],
  Controllers.MerchantOrdersController.getAll
);

MerchantRouter.post(
  ApiPaths.merchantOrders + '/store/:storeId/order/:orderId/:status',
  [authenticateTokenMerchant],
  Controllers.MerchantOrdersController.acceptBanchOrder
);

MerchantRouter.get(
  ApiPaths.merchantOrders + '/:storeId',
  [authenticateTokenMerchant],
  Controllers.MerchantOrdersController.getAllStatusesCount
);
