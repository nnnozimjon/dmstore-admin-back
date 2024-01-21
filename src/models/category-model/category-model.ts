import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

export class Category extends Model {
  id!: number;
  name!: string;
  parent_id?: number | null;
  created_at!: Date;
  updated_at?: Date | null;
}

Category.init(
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
    parent_id: {
      type: DataTypes.INTEGER,
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
    timestamps: false,
    modelName: 'Category',
    tableName: 'category',
  }
);
