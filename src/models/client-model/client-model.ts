import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

// import { Users } from '..';

export class Client extends Model {
  id!: number;
  user_id!: number;
  updated_at!: Date;

  // Additional methods or associations can be defined here
}

Client.init(
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
    updated_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Client',
    tableName: 'clients',
    timestamps: false,
  }
);

// Define the association with the User model
// Users.hasOne(Client, { foreignKey: 'user_id' });
