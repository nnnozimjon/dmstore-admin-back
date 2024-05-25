import { BrandController } from './(admin)/brand-controller';
import { CategoryController } from './(admin)/category-controller';
import { ProductController } from './(admin)/product-controller';
import { AuthController } from './(client)/auth-controller';
import { FrontProductController } from './(client)/fproduct-controller';
import { WidgetsController } from './(client)/fwidgets-controller';
import { OrdersController } from './(client)/orders-controller';
import { otpController } from './(client)/otp-controller';
import { ImageController } from './(general)/image-controller';
import { MailerController } from './(general)/mailer-controller';
import { TelegramController } from './(general)/telegram.bot-controller';
import { ValidatorController } from './(general)/validator-controller';
import { MerchantCategoryController } from './(merchant)/merchant.category-controller';
import { MerchantProductController } from './(merchant)/merchant.product-controller';

export const Controllers = {
  FrontProductController,
  MerchantProductController,
  AuthController,
  ValidatorController,
  ProductController,
  CategoryController,
  BrandController,
  ImageController,
  otpController,
  WidgetsController,
  MerchantCategoryController,
  MailerController,
  OrdersController,
  TelegramController,
};
