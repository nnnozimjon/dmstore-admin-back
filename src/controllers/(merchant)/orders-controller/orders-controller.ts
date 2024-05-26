import { Request, Response } from "express";

import { sequelize } from "@config/db";
import {
  Status200,
  Status400,
  StatusServerError,
} from "@generics/HttpStatuses";
import { OrderItems } from "@models/order-items-model";
import { Orders } from "@models/orders-model";
import { Products } from "@models/product-model";
import { UserStores } from "@models/user-stores-model";
import { baseUrl, frontApi } from "@utils/api-paths";

export class MerchantOrdersController {
  static async getAll(req: Request, res: Response) {
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
        return Status400(res, "Магазин пользователя не найден!");
      }

      const orders = await Orders.findAll({
        where: {
          status_id: 1,
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
      });

      const groupedOrders: any[] = orders.reduce((acc: any, order: any) => {
        const existingOrder: any = acc.find(
          (item: any) => item.id === order.id,
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
          const images = item?.Product?.images?.split(",");
          const addUrls = images?.map(
            (image: string) => baseUrl + frontApi + "/product/image/" + image,
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

      Status200(res, null, { payload: mapped });
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
        return Status400(res, "Магазин пользователя не найден!");
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

      await order.update(
        { status_id: status === "accept" ? 2 : 5 },
        { transaction },
      );
      // Iterate over orderItems and update each instance individually
      for (const orderItem of orderItems) {
        await orderItem.update(
          { status_id: status === "accept" ? 2 : 5 },
          { transaction },
        );
      }

      await transaction.commit();

      Status200(res);
    } catch (error) {
      if (transaction) await transaction.rollback();
      StatusServerError(res);
    }
  }
}
