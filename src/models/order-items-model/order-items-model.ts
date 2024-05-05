import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';
import { Statuses } from '@models/statuses';

import { Merchant, Products } from '..';

export class OrderItems extends Model {
  id!: number;
  order_id!: number;
  product_id!: number;
  store_id!: number;
  status_id!: number;
  quantity!: number;
  color?: string;
  size?: string;
}

OrderItems.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'OrderItems',
    tableName: 'orderItems',
    timestamps: false,
  }
);

// // Define associations

OrderItems.belongsTo(Products, { foreignKey: 'product_id' });
OrderItems.belongsTo(Merchant, { foreignKey: 'store_id' });
OrderItems.belongsTo(Statuses, { foreignKey: 'status_id' });

export default OrderItems;
