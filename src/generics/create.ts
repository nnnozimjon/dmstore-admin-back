import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize';

import { ValidatorController } from '@controllers/(general)/validator-controller'; // Corrected the import

type BodyType = Record<string, any>;

export async function create<T extends Model>(
  model: ModelCtor<T>,
  req: Request,
  res: Response,
  allowedParams: string[],
  requiredParams: string[]
) {
  try {
    const requestBody: BodyType = req.body;

    // Validate required fields
    const validation = ValidatorController.validateRequiredFields(
      requiredParams.reduce((acc: any, param) => {
        acc[param] = requestBody[param];
        return acc;
      }, {})
    );

    if (!validation.valid) {
      return res.status(400).json({
        message: validation.error,
        code: 400,
      });
    }

    // Extract only allowed parameters
    const sanitizedBody: any = allowedParams.reduce((acc: any, param) => {
      if (requestBody.hasOwnProperty(param)) {
        acc[param] = requestBody[param];
      }
      return acc;
    }, {});

    // Create the resource using Sequelize
    await model.create(sanitizedBody);

    res.status(200).json({
      code: 200,
    });
  } catch (error: any) {
    console.error('Error creating resource:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({
        code: 400,
        message: 'Resource with the same unique constraint already exists.',
      });
    } else {
      res.status(500).json({
        code: 500,
        error,
        message: 'Something went wrong!',
      });
    }
  }
}
