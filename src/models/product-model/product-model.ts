import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';
import { Merchant } from '..';

// import { Brand } from '../brand-model'; // Assuming you have a Brand model
// import { Category } from '../category-model'; // Assuming you have a Category model
// import { Models } from '../model-model'; // Assuming you have a Model model

export class Products extends Model {
  id!: number;
  created_by!: number;
  images!: string;
  name!: string;
  service_type!: string;
  price!: number;
  price_in_friday?: number;
  discount?: number;
  description!: string;
  category_id!: number;
  sub_category_id?: number;
  feature_id?: number;
  brand_id?: number;
  model_id?: number;
  colors?: string[]; // Assuming colors can be an array of strings
  sizes?: string[];
  qty?: number;
  condition?: string; // Uncommented
  shipping?: string;
  year?: number;
  vincode?: string;
  rooms?: number;
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
    service_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'product',
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price_in_friday: {
      type: DataTypes.INTEGER,
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
    feature_id: {
      type: DataTypes.INTEGER,
    },
    brand_id: {
      type: DataTypes.INTEGER,
    },
    model_id: {
      type: DataTypes.INTEGER,
    },
    colors: {
      type: DataTypes.STRING,
    },
    sizes: {
      type: DataTypes.STRING,
    },
    qty: {
      type: DataTypes.INTEGER,
    },
    condition: {
      type: DataTypes.STRING(255),
    },
    shipping: {
      type: DataTypes.STRING(255),
    },
    year: {
      type: DataTypes.INTEGER,
    },
    vincode: {
      type: DataTypes.STRING(255),
    },
    rooms: {
      type: DataTypes.INTEGER,
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

Products.belongsTo(Merchant, { foreignKey: 'created_by', targetKey: 'user_id' })