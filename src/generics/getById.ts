import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize';

import { Status200, Status400, StatusServerError } from './HttpStatuses';

export async function getById<T extends Model>(
  model: ModelCtor<T>,
  req: Request,
  res: Response
) {
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
    const item = await model.findByPk(itemId);

    // Check if the item exists
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    Status200(res, null, { payload: item });
  } catch (error) {
    console.error('Error fetching item:', error);
    StatusServerError(res);
  }
}
