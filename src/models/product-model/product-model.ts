import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';

import { Merchant } from '@models/merchant-model';

// import { Brand } from '../brand-model'; // Assuming you have a Brand model
// import { Category } from '../category-model'; // Assuming you have a Category model
// import { Models } from '../model-model'; // Assuming you have a Model model

export class Products extends Model {
  id!: number;
  created_by!: number;
  images!: string;
  name!: string;
  price!: number;
  discount?: number;
  description!: string;
  category_id!: number;
  sub_category_id?: number;
  brand_id?: number;
  qty?: number;
  shipping?: string;
  status?: string;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date | null;
}

Products.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    images: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    brand_id: {
      type: DataTypes.INTEGER,
    },
    qty: {
      type: DataTypes.INTEGER,
    },
    shipping: {
      type: DataTypes.STRING(255),
    },
    status: {
      type: DataTypes.STRING(255),
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Products',
    tableName: 'product',
    timestamps: false,
  }
);

Products.belongsTo(Merchant, {
  foreignKey: 'created_by',
  targetKey: 'id',
});
