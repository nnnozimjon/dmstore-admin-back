/* eslint-disable no-console */
import { Request, Response } from 'express';
import { Status200, Status400, StatusServerError } from 'generics/HttpStatuses';
import { fn, literal, Op } from 'sequelize';

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
        brand_id,
        model_id,
        name,
        price,
        maxPrice,
        year,
        rooms,
        condition,
        order,
      } = req.query;

      const conditions = {
        ...(Number(category_id) && { category_id }),
        ...(Number(brand_id) && { brand_id }),
        ...(Number(model_id) && { model_id }),
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
        ...(Number(year) && { year }),
        ...(Number(rooms) && { rooms }),
        ...(condition && { condition }),
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
          'created_by',
          [
            literal(
              `CONCAT(:baseUrl, REPLACE(images, ",",CONCAT(',',:baseUrl)))`
            ),
            'images',
          ],
          'name',
          [
            literal(
              '(CASE WHEN price_in_friday IS NOT NULL AND DAYOFWEEK(CURRENT_DATE) = 6 THEN price_in_friday ELSE price END)'
            ),
            'price',
          ],
          'description',
          'qty',
        ],
        replacements: { baseUrl: url },
        limit: Number(pageSize),
      });

      // Send the products as a response
      Status200(res, '', { payload: products });
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
          [
            literal(
              `CONCAT(:baseUrl, REPLACE(images, ",",CONCAT(',',:baseUrl)))`
            ),
            'images',
          ],
          'name',
          [
            literal(
              '(CASE WHEN price_in_friday IS NOT NULL AND DAYOFWEEK(CURRENT_DATE) = 6 THEN price_in_friday ELSE price END)'
            ),
            'price',
          ],
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
