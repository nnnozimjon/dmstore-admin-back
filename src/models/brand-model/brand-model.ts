import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

import { Category } from '@models/category-model';

export class Brand extends Model {
  id!: number;
  category_id!: number;
  name!: string;
}

Brand.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Brand',
    tableName: 'brands',
    timestamps: false,
  }
);
