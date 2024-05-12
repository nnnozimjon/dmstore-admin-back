import { AuthController } from './auth-controller';
import { BrandController } from './brand-controller';
import { CategoryController } from './category-controller';
import { FrontProductController } from './fproduct-controller';
import { WidgetsController } from './fwidgets-controller';
import { ImageController } from './image-controller';
import { MailerController } from './mailer-controller';
import { MerchantCategoryController } from './merchant.category-controller';
import { MerchantProductController } from './merchant.product-controller';
import { OrdersController } from './orders-controller';
import { otpController } from './otp-controller';
import { ProductController } from './product-controller';
import { ValidatorController } from './validator-controller';
import { TelegramController } from './telegram.bot-controller';

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
  TelegramController
};
