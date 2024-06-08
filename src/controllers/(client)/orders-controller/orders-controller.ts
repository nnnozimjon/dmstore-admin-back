import { Request, Response } from 'express';
import { literal } from 'sequelize';

import { sequelize } from '@config/db';
import { TelegramController } from '@controllers/(general)/telegram.bot-controller';
import { ValidatorController } from '@controllers/(general)/validator-controller';
import {
  Status200,
  Status400,
  StatusServerError,
} from '@generics/HttpStatuses';
import { Merchant } from '@models/merchant-model';
import { OrderItems } from '@models/order-items-model';
import { Orders } from '@models/orders-model';
import { Products } from '@models/product-model';
import { Statuses } from '@models/statuses-model';
import { baseUrl, frontApi } from '@utils/api-paths';

const url = baseUrl + frontApi + '/product/image/';

export class OrdersController {
  static async getAll(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const client_id = user?.id;

      const { type } = req.query;

      const statuses = type === 'completed' ? [4, 5, 6, 7] : [1, 2, 3, 8];

      const userOrders = await Orders.findAll({
        where: {
          client_id,
        },
        attributes: ['id'],
        order: [['id', 'DESC']],
        include: [
          {
            model: OrderItems,
            attributes: ['id'],
            include: [
              {
                model: Products,
                attributes: [
                  'id',
                  'name',
                  [
                    literal(
                      `CONCAT(:baseUrl, REPLACE(images, ",",CONCAT(',',:baseUrl)))`
                    ),
                    'images',
                  ],
                ],
              },
              {
                model: Statuses,
                attributes: ['name', 'id'],
              },
            ],
            where: {
              status_id: statuses,
            },
          },
        ],
        replacements: { baseUrl: url },
      });

      const formattedOrders = userOrders.flatMap((order: any) => {
        return {
          order_id: order?.id,
          order_item_id: order?.OrderItem?.id,
          order_status: order?.OrderItem?.Status?.name,
          product_id: order?.OrderItem?.Product?.id,
          product_img: order?.OrderItem?.Product?.images,
          product_name: order?.OrderItem?.Product?.name,
        };
      });

      Status200(res, '', { payload: formattedOrders });
    } catch (error) {
      StatusServerError(res);
      console.log(error);
    }
  }

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

        const orderItem = await OrderItems.create(
          {
            order_id: orderId,
            product_id,
            store_id,
            quantity,
            status_id: 1,
            ...(size && { size }),
            ...(color && { color }),
            price,
          },
          { transaction }
        );

        const chatId = '6483120603';
        const image = productDetails.images.split(',')[0];
        const imageUrl = url + image;

        const message = `
📋 Заказ #${orderItem.id}
--------------------------------
📞 Номер телефона: ${phone_number}
🏠 Адрес: ${address}
💬 Комментарий: ${comment}
--------------------------------
🛍️ Продукт:
📦 Количество: ${quantity}
💰 Цена: ${price}
💸 Макс.цена: ${Number(quantity) * Number(price)}
🆔 ID: ${productDetails.id}
--------------------------------
        `;

        await TelegramController.sendTelegramImageMessage(
          chatId,
          imageUrl,
          message
        );
      }

      // Calculate additional charges for multiple stores
      const additionalCharges = storeIds.size * 0;

      totalAmount += additionalCharges;

      // Update the Order with the total amount
      await order.update({ total_amount: totalAmount }, { transaction });

      // Commit the transaction
      await transaction.commit();

      return Status200(res);
    } catch (error) {
      // Rollback the transaction if an error occurs
      if (transaction) await transaction.rollback();
      StatusServerError(res);
    }
  }

  static async update(req: Request, res: Response) {}

  static async delete(req: Request, res: Response) {}
}
