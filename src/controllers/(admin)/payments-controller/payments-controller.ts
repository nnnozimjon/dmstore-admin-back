import { Request, Response } from 'express';
import { literal } from 'sequelize';

import { ValidatorController } from '@controllers/(general)/validator-controller';
import {
  Status200,
  Status400,
  StatusServerError,
} from '@generics/HttpStatuses';
import { uploadImage } from '@generics/uploadImage';
import { PaymentTypes } from '@models/payment-types';
import { baseUrl, frontApi } from '@utils/api-paths';

const url = baseUrl + frontApi + '/widget/image/';

export class PaymentsController {
  static async getAll(req: Request, res: Response) {
    try {
      const payments = await PaymentTypes.findAll({
        attributes: [
          'id',
          'title',
          'description',
          [
            literal(
              `CONCAT(:baseUrl, REPLACE(image, ",",CONCAT(',',:baseUrl)))`
            ),
            'image',
          ],
        ],
        replacements: { baseUrl: url },
      });

      Status200(res, null, {
        payload: payments,
      });
    } catch (error) {
      StatusServerError(res);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { title, description } = req.body;

      const image: any = req.file;

      const requiredParams = { title };

      const validation =
        ValidatorController.validateRequiredFields(requiredParams);

      if (!validation.valid) {
        return Status400(res);
      }

      if (image === undefined) {
        return Status400(res);
      }

      if (image?.length === 0) {
        return Status400(res);
      }

      const imageNames = await uploadImage([image], 'widgets');
      const commaSeparatedString: string | undefined = imageNames?.join(',');

      await PaymentTypes.create({
        title,
        ...(String(description) && { description }),
        image: commaSeparatedString,
      });

      return Status200(res);
    } catch (error) {
      StatusServerError(res);
    }
  }
}
