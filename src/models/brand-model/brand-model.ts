import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

import { Category } from '@models/category-model';

export class Brand extends Model {
  id!: number;
  name!: string;
  label!: string;
}

Brand.init(
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
    label: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Brand',
    tableName: 'brands',
    timestamps: false,
  }
);
