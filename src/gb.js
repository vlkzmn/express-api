/* eslint-disable max-len */
import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize(process.env.ELEPHANT_SQL_URL);

// export const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DB,
//   username: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   logging: false,
// });