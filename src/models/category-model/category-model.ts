import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

export class Category extends Model {
  id!: number;
  name!: string;
  parent_id?: number | null;
  is_active!: boolean;
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
    is_active: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'category',
    tableName: 'category',
  }
);

Category.hasMany(Category, { foreignKey: 'parent_id', as: 'subCategories' });
// Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'sub' });
