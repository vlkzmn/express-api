/* eslint-disable max-len */
import { Sequelize } from 'sequelize';
// import 'dotenv/config';

export const sequelize = new Sequelize('postgres://tardiemz:9unqUYttcFk-RPMa-dVWFfvqvEWL2N6M@cornelius.db.elephantsql.com/tardiemz');

// export const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DB,
//   username: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   logging: false,
// });
