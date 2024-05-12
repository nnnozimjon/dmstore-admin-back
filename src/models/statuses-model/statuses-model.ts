import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

export class Statuses extends Model {
  id!: number;
  name!: string;
  code!: string;
}

Statuses.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Statuses',
    tableName: 'statuses',
    timestamps: false,
  }
);

export default Statuses;
