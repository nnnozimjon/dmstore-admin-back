import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize';

export async function getById<T extends Model>(
  model: ModelCtor<T>,
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    // Check if the ID is provided
    if (!id) {
      return res.status(400).json({ error: 'ID parameter is required' });
    }

    // Convert the ID to a number
    const itemId = Number.parseInt(id, 10);

    // Check if the ID is a valid number
    if (isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid ID parameter' });
    }

    // Find the item by ID
    const item = await model.findByPk(itemId);

    // Check if the item exists
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ payload: item });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({
      code: 500,
      error,
      message: 'Что-то пошло не так!',
    });
  }
}
