// models/otp.js
import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

export class OTP extends Model {
  id!: number;
  email!: string;
  otp_value!: string;
  expiration_time!: Date;
  is_used!: boolean;
  created_at!: Date;
}

OTP.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp_value: {
      type: DataTypes.STRING(6), // Adjust the length as needed
      allowNull: false,
    },
    expiration_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'OTP',
    tableName: 'otp',
    timestamps: false,
  }
);
