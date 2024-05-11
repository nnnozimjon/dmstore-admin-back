import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

export class Category extends Model {
  id!: number;
  name!: string;
  parent_id?: number | null;
  created_at!: Date;
}

Category.init(
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
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'category',
    tableName: 'category',
  }
);

Category.hasMany(Category, { foreignKey: 'parent_id', as: 'sub' });
// Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'sub' });
