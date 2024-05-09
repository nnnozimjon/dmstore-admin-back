/* eslint-disable no-console */
import { Request, Response } from 'express';
import { Status200, Status400, StatusServerError } from 'generics/HttpStatuses';
import { fn, literal, Op } from 'sequelize';

import { Merchant } from '@models/merchant-model';
import { Products } from '@models/product-model';
import { baseUrl, frontApi } from '@utils/api-paths';

const url = baseUrl + frontApi + '/product/image/';

export class FrontProductController {
  static async getByPagination(req: Request, res: Response) {
    try {
      const {
        pageNumber = 1,
        pageSize = 20,
        category_id,
        sub_category_id,
        brand_id,
        name,
        price,
        maxPrice,
        order,
        ids,
      } = req.query;

      const productIds = ids ? String(ids).split(',') : [];

      const conditions = {
        ...(productIds.length > 0 && { id: productIds }),
        ...(Number(category_id) && { category_id }),
        ...(Number(sub_category_id) && { sub_category_id }),
        ...(Number(brand_id) && { brand_id }),
        ...(name && {
          name: {
            [Op.like]: `%${name}%`,
          },
        }),
        ...(Number(price) && {
          price: {
            // [Op.lte]: price
            ...(price && !maxPrice ? { [Op.lte]: price } : { [Op.gte]: price }), // minPrice
            ...(maxPrice && { [Op.lte]: maxPrice }), // maxPrice
          },
        }),
        status: 'active',
      };

      const orderCriteria: any =
        order === 'asc'
          ? [['id', 'ASC']]
          : order === 'desc'
            ? [['id', 'DESC']]
            : order === 'rand'
              ? [fn('RAND')]
              : [['id', 'ASC']];

      // Perform the Sequelize query
      const products = await Products.findAll({
        where: conditions,
        order: orderCriteria,
        offset: (Number(pageNumber) - 1) * Number(pageSize),
        attributes: [
          'id',
          [
            literal(
              `CONCAT(:baseUrl, REPLACE(images, ",",CONCAT(',',:baseUrl)))`
            ),
            'images',
          ],
          'name',
          'price',
          'description',
          'qty',
        ],
        include: [
          {
            model: Merchant,
            attributes: ['storeName', 'id'],
            required: true,
            as: 'Merchant',
          },
        ],
        replacements: { baseUrl: url },
        limit: Number(pageSize),
      });

      const flattenedProducts = products.map((product) => {
        const { Merchant, ...rest } = product.toJSON();
        return {
          ...rest,
          storeName: Merchant.storeName,
          created_by: Merchant.id,
        };
      });

      // Send the products as a response
      Status200(res, '', { payload: flattenedProducts });
    } catch (error) {
      console.log(error);
      StatusServerError(res);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Check if the ID is provided
      if (!id) {
        return Status400(res);
      }
      // Convert the ID to a number
      const itemId = Number.parseInt(id, 10);
      // Check if the ID is a valid number
      if (isNaN(itemId)) {
        return Status400(res);
      }
      // Find the item by ID
      const item = await Products.findOne({
        where: {
          id: itemId,
          status: 'active',
        },
        attributes: [
          'id',
          'created_by',
          'category_id',
          'sub_category_id',
          'shipping',
          'created_at',
          [
            literal(
              `CONCAT(:baseUrl, REPLACE(images, ",",CONCAT(',',:baseUrl)))`
            ),
            'images',
          ],
          'name',
          'price',
          'description',
          'qty',
        ],
        replacements: { baseUrl: url },
      });

      // Check if the item exists
      if (!item) {
        return Status400(res, 'Продукт не найден!');
      }

      Status200(res, null, {
        payload: item,
      });
    } catch (error) {
      console.error('Error fetching item:', error);
      StatusServerError(res);
    }
  }
}
