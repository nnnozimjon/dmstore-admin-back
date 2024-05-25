import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

export class Merchant extends Model {
  id!: number;
  store_name!: string;
  description?: string;
  header_image?: string;
  store_image?: string;
  city_id!: number;
}

Merchant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    store_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
    },
    header_image: {
      type: DataTypes.STRING(255),
    },
    store_image: {
      type: DataTypes.STRING(255),
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Merchant',
    tableName: 'merchants',
    timestamps: false,
  }
);

export default Merchant;
