import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize';

export async function deleteById<T extends Model>(
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
    const itemToDelete = await model.findByPk(itemId);

    // Check if the item exists
    if (!itemToDelete) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Perform the delete operation
    await itemToDelete.destroy();

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      code: 500,
      error,
      message: 'Что-то пошло не так!',
    });
  }
}
