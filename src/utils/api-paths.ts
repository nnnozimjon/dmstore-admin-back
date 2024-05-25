import dotenv from 'dotenv';
import path from 'path';

const { parsed } = dotenv.config({
  path: path.resolve(__dirname, '../', '../', '.env'),
});

export const baseUrl = parsed!.BASEURL;
export const adminApi = '/admin/api/v1'; // admin panel api
export const frontApi = '/store/api/v1'; // front api
export const merchantApi = '/merchant/api/v1'; // merchant api

export const ApiPaths = {
  register: '/auth/sign-up',
  login: '/auth/sign-in',
  sendOtpToRegister: '/auth/otp',
  isUserAvailable: '/auth/availability',
  // admin paths
  category: '/category',
  brand: '/brand',
  model: '/model',
  product: '/product',

  // merchant paths
  merchantRegister: '/auth/sign-up',
  merchantLogin: '/auth/sign-in',

  merchantProduct: '/product',
  merchantOtp: '/otp',
  merchantCategory: '/category',

  // front paths
  frontCategory: '/category',
  frontProduct: '/product',
  frontWidget: '/widget',
  frontOrderProduct: '/order',
};
