import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

export class AttributeValue extends Model {
  id!: number;
  attribute_id!: number;
  value!: string;
}

AttributeValue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    attribute_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'AttributeValue',
    tableName: 'attribute_values',
    timestamps: false,
  }
);
