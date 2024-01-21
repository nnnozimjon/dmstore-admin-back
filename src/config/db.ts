import dotenv from 'dotenv';
import path from 'path';
import { Sequelize } from 'sequelize';

const { parsed } = dotenv.config({
  path: path.resolve(__dirname, '../../', '.env'),
});

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: parsed!.HOST,
  database: parsed!.DATABASE,
  username: parsed!.USER,
  password: parsed!.PASSWORD,
});
