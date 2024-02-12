export const adminApi = '/admin/api/v1'; // admin panel api
export const frontApi = '/store/api/v1'; // front api

const mergeAdminApi = (route: string): string => {
  return adminApi + route;
};

const mergeFrontApi = (route: string): string => {
  return frontApi + route;
};

export const ApiPaths = {
  // admin paths
  category: mergeAdminApi('/category'),
  brand: mergeAdminApi('/brand'),
  model: mergeAdminApi('/model'),
  product: mergeAdminApi('/product'),

  // merchant paths

  // front paths
  categories: mergeFrontApi('/category'),
};
