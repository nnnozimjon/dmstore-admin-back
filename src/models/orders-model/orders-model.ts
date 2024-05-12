import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';
import { OrderItems } from '@models/order-items-model';
import { Statuses } from '@models/statuses-model';
import { Users } from '@models/users-model';

export class Orders extends Model {
  id!: number;
  client_id!: number;
  phone_number!: string;
  comment?: string;
  order_date?: Date;
  total_amount?: number;
  status_id!: number;
  address!: string;
}

Orders.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Orders',
    tableName: 'orders',
    timestamps: false,
  }
);

Orders.hasOne(OrderItems, { foreignKey: 'order_id' });

Orders.belongsTo(Users, { foreignKey: 'client_id' });
Orders.belongsTo(Statuses, { foreignKey: 'status_id' });

export default Orders;
