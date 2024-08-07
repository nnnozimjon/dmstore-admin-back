/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable unicorn/prefer-number-properties */
/* eslint-disable sonarjs/no-collapsible-if */
import fs from "fs";
import { Request, Response } from "express";
import { Status200, Status400, StatusServerError } from "generics/HttpStatuses";
import { uploadImage } from "generics/uploadImage";
import path from "path";
import { literal } from "sequelize";

import { ValidatorController } from "@controllers/validator-controller";
import { Products } from "@models/product-model";
import { baseUrl, frontApi } from "@utils/api-paths";
import { Merchant } from "@models/merchant-model";

const url = baseUrl + frontApi + "/product/image/";

export class MerchantProductController {
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const created_by = user.id;

      // Validate id
      if (!id) {
        return Status400(res, "");
      }

      const productInfo = await Products.findOne({
        where: {
          created_by,
          id,
        },
        attributes: [
          "id",
          "name",
          "price",
          "description",
          "qty",
          "shipping",
          // "colors",
          // "sizes",
          // "price_in_friday",
          "category_id",
          "sub_category_id",
          [
            literal(
              `CONCAT(:baseUrl, REPLACE(images, ",",CONCAT(',',:baseUrl)))`,
            ),
            "images",
          ],
        ],
        replacements: { baseUrl: url },
      });

      // Check if product exists
      if (!productInfo) {
        return res
          .status(404)
          .json({ code: 404, message: "Продукт не найден!" });
      }

      const payload = {
        payload: productInfo,
      };

      Status200(res, "", payload);
    } catch (error) {
      console.log(error);
      return StatusServerError(res);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const created_by = user.id;

      const products = await Products.findAll({
        where: {
          created_by,
        },
        order: [["id", "DESC"]],
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
        replacements: { baseUrl: url },
      });

      Status200(res, "", { payload: products });
    } catch (error) {
      console.log(error);
      return StatusServerError(res);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data: any = req.files;
      const user = (req as any).user;
      
      const created_by = user.id;

      const images = data.images;

      const {
        name,
        // service_type,
        price, //number
        // price_in_friday, //number
        discount, //number
        description,
        category_id,
        // feature_id,
        brand_id,
        // model_id,
        // colors,
        // sizes,
        qty, // number
        // condition,
        shipping,
        // year, //number
        // vincode,
        // rooms,
        status,
      } = req.body;

      const requiredParams = {
        created_by,
        images,
        name,
        // service_type,
        price,
        description,
        category_id,
      };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res);
      }

      if (images?.length === 0) {
        return Status400(res);
      }

      // Quantity || qty
      if (qty) {
        if ((qty !== null && Number(qty) <= 0) || isNaN(Number(qty))) {
          return Status400(res, "Количество должно быть числом больше нуля.");
        }
      }

      // Price , not null
      if ((price !== null && Number(price) <= 0) || isNaN(Number(price))) {
        return Status400(res, "Цена должно быть числом больше нуля.");
      }


      const imageNames = await uploadImage(images, "products");
      const commaSeparatedString: string | undefined = imageNames?.join(",");

      const merchantDetails = await Merchant.findOne({
        where: {
          user_id: created_by,
        }
      })

      await Products.create({
        created_by: merchantDetails?.id,
        images: commaSeparatedString,
        name,
        // service_type,
        price,
        // ...(Number(price_in_friday) && { price_in_friday }),
        ...(Number(discount) && { discount }),
        description,
        category_id,
        // ...(Number(feature_id) && { feature_id }),
        ...(Number(brand_id) && { brand_id }),
        // ...(Number(model_id) && { model_id }),
        // ...(String(colors) && { colors }),
        // ...(String(sizes) && { sizes }),
        ...(Number(qty) && { qty }),
        // condition,
        ...(shipping ? { shipping } : { shipping: "free" }),
        // year,
        // vincode,
        // rooms,
        status,
      });

      return Status200(res, null);
    } catch (error) {
      console.log(error);
      return StatusServerError(res);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, price, description, qty, shipping, images } = req.body;
      const user = (req as any).user;
      const created_by = user.id;

      // const prevImages = [];
      // const newImages = [];

      // const deletedImages = [];

      // Validate id
      if (!id) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      // Find product by ID
      let product = await Products.findOne({
        where: {
          created_by,
          id,
        },
      });

      // Check if product exists
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Update product data
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.qty = qty || product.qty;
      product.shipping = shipping || product.shipping;

      // Update images if provided
      if (images) {
        // Delete old images from server
        const oldImages = product.images.split(",");
        oldImages.forEach((image) => {
          const imagePath = path.join(
            __dirname,
            "..",
            "..",
            "assets",
            "products",
            image,
          );
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });

        // Save new images to server
        const newImages = images.split(",");
        product.images = newImages.join(",");
      }

      // Save updated product data to database
      await product.save();

      // Respond with success message
      return res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      console.error(error);
      // Log error and send 500 status for server errors
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const created_by = user.id;

      if (!id) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const product = await Products.findOne({
        where: {
          created_by,
          id,
        },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const images = product.images.split(",");
      images.forEach((image) => {
        const imagePath = path.join(
          __dirname,
          "..",
          "..",
          "assets",
          "products",
          image,
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      // Delete product from database
      await Products.destroy({
        where: {
          id,
        },
      });

      Status200(res, "");
    } catch (error) {
      console.log(error);
      return StatusServerError(res);
    }
  }
}
