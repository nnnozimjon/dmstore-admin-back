import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

export class PaymentTypes extends Model {
  id!: number;
  title!: string;
  image!: string;
  description?: string;
}

PaymentTypes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'PaymentTypes',
    tableName: 'payment_types',
    timestamps: false,
  }
);
