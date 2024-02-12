import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize';

function removePropertiesFromArray(arr: any, propertiesToRemove: string[]) {
  return arr.map((obj: any) => {
    if (obj instanceof Model) {
      obj = obj.get();
    }
    const newObj = { ...obj };
    propertiesToRemove.forEach((prop) => delete newObj[prop]);
    return newObj;
  });
}

export async function getAll<T extends Model>(
  model: ModelCtor<T>,
  req: Request,
  res: Response,
  needItems: string[]
) {
  try {
    const pageSize = Number.parseInt(req.body.pageSize, 10) || 10;
    const pageNumber = Number.parseInt(req.body.pageNumber, 10) || 1;
    const offset = (pageNumber - 1) * pageSize;
    const { count, rows } = await model.findAndCountAll({
      limit: pageSize,
      offset,
    });

    const totalPages = Math.ceil(count / pageSize);

    const payload = removePropertiesFromArray(rows, needItems);

    res.status(200).json({
      payload,
      total_page: totalPages,
      pageNumber,
      total_count: count,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      error,
      message: 'Что-то пошло не так!',
    });
  }
}
