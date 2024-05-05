/* eslint-disable no-console */
import { Request, Response } from 'express';

import { sequelize } from '@config/db';
import { ValidatorController } from '@controllers/validator-controller';
import {
  Status200,
  Status400,
  StatusServerError,
} from '@generics/HttpStatuses';
import { Merchant } from '@models/merchant-model';
import { OrderItems } from '@models/order-items-model';
import { Orders } from '@models/orders-model';
import { Products } from '@models/product-model';

export class OrdersController {
  static async getAll(req: Request, res: Response) {}

  static async getById(req: Request, res: Response) {}

  static async create(req: Request, res: Response) {
    let transaction;

    try {
      const { phone_number, comment, products, address } = req.body;
      const user = (req as any).user;
      
      const client_id = user?.id;

      const requiredParams = { client_id, phone_number, address };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res);
      }

      if (products?.length === 0) {
        return Status400(res, 'Поле «Товары» не может быть пустым!');
      }

      // Start transaction
      transaction = await sequelize.transaction();

      let totalAmount = 0;
      const storeIds = new Set();

      const order = await Orders.create(
        {
          client_id,
          phone_number,
          ...(comment && { comment }),
          status_id: 1,
          address,
        },
        { transaction }
      );

      const orderId = order.id;

      for (const product of products) {
        const { product_id, store_id, quantity, size, color } = product;
        const requiredParams = { product_id, store_id, quantity };

        const validation =
          ValidatorController.validateRequiredFields(requiredParams);

        if (!validation.valid) {
          return Status400(res, 'Параметры поля «Товары» указаны неправильно!');
        }

        // check product exists
        const productDetails = await Products.findOne({
          where: {
            id: product_id,
          },
        });

        if (!productDetails) {
          return Status400(res, 'ID продукта не найден!');
        }

        // check store exists
        const storeDetails = await Merchant.findOne({
          where: {
            id: store_id,
          },
        });

        if (!storeDetails) {
          return Status400(res, 'ID магазина не найден!');
        }

        const price = productDetails.price;

        totalAmount += Number(price) * Number(quantity);

        storeIds.add(storeDetails.id);

        await OrderItems.create(
          {
            order_id: orderId,
            product_id,
            store_id,
            quantity,
            status_id: 1,
            ...(size && { size }),
            ...(color && { color }),
          },
          { transaction }
        );
      }

      // Calculate additional charges for multiple stores
      const additionalCharges = storeIds.size * 25;

      totalAmount += additionalCharges;

      // Update the Order with the total amount
      await order.update({ total_amount: totalAmount }, { transaction });

      // Commit the transaction
      await transaction.commit();

      return Status200(res);
    } catch (error) {
      // Rollback the transaction if an error occurs
      if (transaction) await transaction.rollback();
      console.log(error);
      StatusServerError(res);
    }
  }

  static async update(req: Request, res: Response) {}

  static async delete(req: Request, res: Response) {}
}
