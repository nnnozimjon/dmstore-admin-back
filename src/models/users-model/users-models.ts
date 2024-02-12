import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

export class Users extends Model {
  id!: number;
  username!: string;
  password!: string;
  phone_number!: string;
  fio!: string;
  user_role!: string;
  is_active!: number;
  created_at!: Date;
  deleted_at!: Date | null;
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fio: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_role: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true, // Allow null for soft delete
    },
  },
  {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    timestamps: false,
  }
);
