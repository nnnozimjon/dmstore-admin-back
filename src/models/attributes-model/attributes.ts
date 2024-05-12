import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

export class Attributes extends Model {
  id!: number;
  name!: string;
  label!: string;
}

Attributes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Attributes',
    tableName: 'attributes',
    timestamps: false,
  }
);
