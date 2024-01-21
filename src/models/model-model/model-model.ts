import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

import { Brand } from '../brand-model'; // Assuming you have a Brand model

export class Models extends Model {
  id!: number;
  brand_id!: number;
  name!: string;
  created_at!: Date;
  updated_at?: Date | null;
}

Models.init(
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
      references: {
        model: Brand,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Model',
    tableName: 'models',
    timestamps: false,
  }
);
