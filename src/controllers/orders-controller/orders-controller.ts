/* eslint-disable no-console */
import { Request, Response } from "express";
import { literal } from "sequelize";

import { sequelize } from "@config/db";
import { ValidatorController } from "@controllers/validator-controller";
import {
  Status200,
  Status400,
  StatusServerError,
} from "@generics/HttpStatuses";
import { Merchant } from "@models/merchant-model";
import { OrderItems } from "@models/order-items-model";
import { Orders } from "@models/orders-model";
import { Products } from "@models/product-model";
import { Statuses } from "@models/statuses";
import { baseUrl, frontApi } from "@utils/api-paths";

const url = baseUrl + frontApi + "/product/image/";

export class OrdersController {
  static async getAll(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const client_id = user?.id;

      const { type } = req.query;

      const statuses = type === "completed" ? [4] : [1, 2, 3, 5, 6, 7, 8];

      const userOrders = await Orders.findAll({
        where: {
          client_id,
        },
        attributes: ["id"],
        order: [["id", "DESC"]],
        include: [
          {
            model: OrderItems,
            attributes: ["id"],
            include: [
              {
                model: Products,
                attributes: [
                  "id",
                  "name",
                  [
                    literal(
                      `CONCAT(:baseUrl, REPLACE(images, ",",CONCAT(',',:baseUrl)))`,
                    ),
                    "images",
                  ],
                ],
              },
              {
                model: Statuses,
                attributes: ["name", "id"],
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
        const orderItems = order?.OrderItems?.map((or: any) => {
          return {
            order_id: order?.id,
            order_item_id: or?.id,
            order_status: or?.Status?.name,
            product_id: or?.Product?.id,
            product_img: or?.Product?.images,
            product_name: or?.Product?.name,
          };
        });

        return orderItems;
      });

      Status200(res, "", { payload: formattedOrders });
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
        return Status400(res, "Поле «Товары» не может быть пустым!");
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
        { transaction },
      );

      const orderId = order.id;

      for (const product of products) {
        const { product_id, store_id, quantity, size, color } = product;
        const requiredParams = { product_id, store_id, quantity };

        const validation =
          ValidatorController.validateRequiredFields(requiredParams);

        if (!validation.valid) {
          return Status400(res, "Параметры поля «Товары» указаны неправильно!");
        }

        // check product exists
        const productDetails = await Products.findOne({
          where: {
            id: product_id,
          },
        });

        if (!productDetails) {
          return Status400(res, "ID продукта не найден!");
        }

        // check store exists
        const storeDetails = await Merchant.findOne({
          where: {
            id: store_id,
          },
        });

        if (!storeDetails) {
          return Status400(res, "ID магазина не найден!");
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
          { transaction },
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
