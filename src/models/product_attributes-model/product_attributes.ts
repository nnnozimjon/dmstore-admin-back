import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

export class ProductAttributes extends Model {
  id!: number;
  attribute_value_id!: string;
  product_id!: number;
}

ProductAttributes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    attribute_value_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ProductAttributes',
    tableName: 'product_attributes',
    timestamps: false,
  }
);
