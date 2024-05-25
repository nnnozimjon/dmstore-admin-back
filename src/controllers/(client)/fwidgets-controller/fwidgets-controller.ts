import { Request, Response } from 'express';
import { Status200, Status400, StatusServerError } from 'generics/HttpStatuses';
import { literal } from 'sequelize';

import { Category } from '@models/category-model';
import { Widgets } from '@models/widgets-model';
import { baseUrl, frontApi } from '@utils/api-paths';

const url = baseUrl + frontApi + '/widget/image/';

export class WidgetsController {
  static async getAll(req: Request, res: Response) {
    try {
      const { location } = req.query;

      if (!location) {
        return Status400(res);
      }

      const widgets = await Widgets.findAll({
        where: {
          location,
        },
        include: {
          model: Category,
          as: 'ct',
          attributes: ['name'],
        },
        attributes: [
          'id',
          'category_id',
          'name',
          [
            literal(
              `CONCAT(:baseUrl, REPLACE(image, ",",CONCAT(',',:baseUrl)))`
            ),
            'image',
          ],
        ],
        replacements: { baseUrl: url },
      });

      Status200(res, '', {
        payload: widgets,
      });
    } catch (error) {
      StatusServerError(res);
    }
  }

  static create(req: Request, res: Response) { }
  static update(req: Request, res: Response) { }
  static delete(req: Request, res: Response) { }
}
