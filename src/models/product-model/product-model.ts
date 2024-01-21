import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

import { Brand } from '../brand-model'; // Assuming you have a Brand model
import { Category } from '../category-model'; // Assuming you have a Category model
import { Models } from '../model-model'; // Assuming you have a Model model

export class Product extends Model {
  id!: number;
  name!: string;
  description!: string;
  category_id?: number | null;
  brand_id?: number | null;
  model_id?: number | null;
  created_at!: Date;
  deleted_at?: Date | null;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: 'id',
      },
    },
    brand_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Brand,
        key: 'id',
      },
    },
    model_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Models,
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'product',
    timestamps: false,
  }
);
