import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

export class Cities extends Model {
  id!: number;
  label!: string;
  value!: string;
}

Cities.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Cities',
    tableName: 'cities',
    timestamps: false,
  }
);
