import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';


export class CategoryBrands extends Model {
  id!: number;
  brand_id!: number;
  category_id!: number;
}

CategoryBrands.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Brand',
    tableName: 'category_brands',
    timestamps: false,
  }
);
