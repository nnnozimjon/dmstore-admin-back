import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

import { Category } from '..';

export class Widgets extends Model {
  id!: number;
  category_id!: number;
  name!: string;
  image!: string;
  location!: string;
}

Widgets.init(
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
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'Widgets',
    tableName: 'widgets',
  }
);

Widgets.belongsTo(Category, { foreignKey: 'category_id', as: 'ct' });
