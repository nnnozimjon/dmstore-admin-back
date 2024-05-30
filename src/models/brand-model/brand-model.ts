import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';


export class Brand extends Model {
  id!: number;
  name!: string;
  image!: string;
}

Brand.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Brand',
    tableName: 'brands',
    timestamps: false,
  }
);
