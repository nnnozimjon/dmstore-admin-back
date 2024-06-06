import { Request, Response } from 'express';
import { fn, literal } from 'sequelize';

import { sequelize } from '@config/db';
import {
  Status200,
  Status400,
  StatusServerError,
} from '@generics/HttpStatuses';
import { OrderItems } from '@models/order-items-model';
import { Orders } from '@models/orders-model';
import { Products } from '@models/product-model';
import { UserStores } from '@models/user-stores-model';
import { baseUrl, frontApi } from '@utils/api-paths';

export class MerchantOrdersController {
  static async getAll(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const user_id = user.id;
      const store_id = req.params.storeId;
      const status_id = req.params.statusId;

      const { pageNumber = 1, pageSize = 10 } = req.query;

      if (!store_id) {
        return Status400(res);
      }

      const store = await UserStores.findOne({
        where: {
          user_id,
          store_id,
        },
      });

      if (!store) {
        return Status400(res, 'Магазин пользователя не найден!');
      }

      const totalCount = await Orders.count({
        where: {
          status_id,
        },
        include: [
          {
            model: OrderItems,
            where: {
              store_id,
            }
          },
        ],
      });

      const orders = await Orders.findAll({
        offset: (Number(pageNumber) - 1) * Number(pageSize),
        where: {
          status_id,
        },
        include: [
          {
            model: OrderItems,
            where: {
              store_id,
            },
            include: [
              {
                model: Products,
              },
            ],
          },
        ],
        limit: Number(pageSize),
      });

      const groupedOrders: any[] = orders.reduce((acc: any, order: any) => {
        const existingOrder: any = acc.find(
          (item: any) => item.id === order.id
        );
        if (existingOrder) {
          existingOrder.OrderItem.push(order.OrderItem);
        } else {
          acc.push({
            ...order.toJSON(),
            OrderItem: [order.OrderItem],
          });
        }
        return acc;
      }, []);

      const mapped = groupedOrders.map((order) => {
        const orderItems = order?.OrderItem?.map((item: any) => {
          const images = item?.Product?.images?.split(',');
          const addUrls = images?.map(
            (image: string) => baseUrl + frontApi + '/product/image/' + image
          );
          return {
            id: item?.id,
            quantity: item?.quantity,
            color: item?.color,
            size: item?.size,
            price: item?.price,
            product_name: item?.Product?.name,
            images: addUrls,
          };
        });
        return {
          id: order?.id,
          phone_number: order?.phone_number,
          comment: order?.comment,
          address: order?.address,
          total_amount: order?.total_amount,
          order_date: order?.order_date,
          order_items: orderItems,
        };
      });

      const totalPages = Math.ceil(Number(totalCount) / Number(pageSize));

      Status200(res, null, { payload: mapped, totalPages });
    } catch (error) {
      StatusServerError(res);
    }
  }

  static async acceptBanchOrder(req: Request, res: Response) {
    let transaction;
    try {
      const user = (req as any).user;
      const user_id = user.id;
      const store_id = req.params.storeId;
      const order_id = req.params.orderId;
      const status = req.params.status;

      if (!store_id) {
        return Status400(res);
      }

      const store = await UserStores.findOne({
        where: {
          user_id,
          store_id,
        },
      });

      if (!store) {
        return Status400(res, 'Магазин пользователя не найден!');
      }

      transaction = await sequelize.transaction();

      const order: any = await Orders.findOne({
        where: {
          id: order_id,
        },
        transaction,
      });

      const orderItems: any = await OrderItems.findAll({
        where: {
          order_id,
        },
        include: [
          {
            model: Products,
            where: {
              created_by: store_id,
            },
          },
        ],
        transaction,
      });

      await order.update({ status_id: status }, { transaction });
      // Iterate over orderItems and update each instance individually
      for (const orderItem of orderItems) {
        await orderItem.update({ status_id: status }, { transaction });
      }

      await transaction.commit();

      Status200(res);
    } catch (error) {
      if (transaction) await transaction.rollback();
      StatusServerError(res);
    }
  }

  static async getAllStatusesCount(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const user_id = user.id;
      const store_id = req.params.storeId;

      if (!store_id) {
        return Status400(res);
      }

      const store = await UserStores.findOne({
        where: {
          user_id,
          store_id,
        },
      });

      if (!store) {
        return Status400(res, 'Магазин пользователя не найден!');
      }

      const orders = await Orders.findAll({
        attributes: [
          [
            fn(
              'COUNT',
              literal(
                'DISTINCT CASE WHEN Orders.status_id = 1 THEN Orders.id END'
              )
            ),
            'all',
          ],
          [
            fn(
              'COUNT',
              literal(
                'DISTINCT CASE WHEN Orders.status_id = 2 THEN Orders.id END'
              )
            ),
            'process',
          ],
          [
            fn(
              'COUNT',
              literal(
                'DISTINCT CASE WHEN Orders.status_id = 5 THEN Orders.id END'
              )
            ),
            'canceled',
          ],
          [
            fn(
              'COUNT',
              literal(
                'DISTINCT CASE WHEN Orders.status_id = 4 THEN Orders.id END'
              )
            ),
            'completed',
          ],
        ],
        include: [
          {
            model: OrderItems,
            attributes: [],
            where: {
              store_id,
            },
          },
        ],
        raw: true,
      });

      Status200(res, null, {
        payload: orders[0],
      });
    } catch (error) {
      StatusServerError(res);
    }
  }
}
