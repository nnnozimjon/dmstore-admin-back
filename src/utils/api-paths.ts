export const baseApi = '/admin/api/v1';

const merge = (route: string): string => {
  return baseApi + route;
};

export const ApiPaths = {
  // category
  category: merge('/category'),

  // brands
  brand: merge('/brand'),

  // models
  model: merge('/model'),

  // products
  product: merge('/product'),
};
