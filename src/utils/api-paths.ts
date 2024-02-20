export const baseUrl = 'http://localhost:8002';
export const adminApi = '/admin/api/v1'; // admin panel api
export const frontApi = '/store/api/v1'; // front api
export const merchantApi = '/merchant/api/v1'; // merchant api

const mergeAdminApi = (route: string): string => {
  return adminApi + route;
};

const mergeFrontApi = (route: string): string => {
  return frontApi + route;
};

const mergeMerchantApi = (route: string): string => {
  return merchantApi + route;
};

export const ApiPaths = {
  register: '/store/api/v1/auth/sign-up',
  login: '/store/api/v1/auth/sign-in',
  // admin paths
  category: mergeAdminApi('/category'),
  brand: mergeAdminApi('/brand'),
  model: mergeAdminApi('/model'),
  product: mergeAdminApi('/product'),

  // merchant paths
  merchantProduct: mergeMerchantApi('/product'),
  merchantOtp: mergeMerchantApi('/otp'),

  // front paths
  frontCategory: mergeFrontApi('/category'),
  frontProduct: mergeFrontApi('/product'),
};
