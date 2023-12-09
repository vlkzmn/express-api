import { DataTypes } from 'sequelize';
import { sequelize } from '../gb.js';

export const Room = sequelize.define(
  'room',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
);
