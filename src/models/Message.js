import { DataTypes } from 'sequelize';
import { sequelize } from '../gb.js';
import { Room } from './Room.js';

export const Message = sequelize.define(
  'message',
  {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Message.belongsTo(Room);
Room.hasOne(Message);
