import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';
import { Users } from '@models/users-model';

export class Merchant extends Model {
  id!: number;
  user_id!: number;
  store_name!: string;
  description?: string;
  header_image?: string;
  store_image?: string;
  city_id!: number;
  // Additional methods or associations can be defined here
}

Merchant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

Merchant.belongsTo(Users, { foreignKey: 'user_id' });

export default Merchant;
