import { Room } from '../models/Room.js';
import { Message } from '../models/Message.js';

async function getAllRooms() {
  const allRooms = await Room.findAll({
    order: ['createdAt'],
  });

  return allRooms.map((room) => normalizeRoom(room));
}

async function getOneRoom(id) {
  const allRooms = await Room.findOne({ where: { id } });

  return allRooms;
}

async function createRoom(title, author) {
  await Room.create({
    title,
    author,
  });
}

async function renameRoom(id, title) {
  await Room.update({ title }, { where: { id } });
}

async function deleteRoom(id) {
  await Message.destroy({ where: { roomId: id } });
  await Room.destroy({ where: { id } });
}

function normalizeRoom({ id, title, author }) {
  return {
    id,
    title,
    author,
  };
}

async function getMessages(roomId) {
  const messages = await Message.findAll({ where: { roomId } });

  return messages;
}

async function createMessage(author, text, date, roomId) {
  await Message.create({
    author,
    text,
    date,
    roomId,
  });
}

export const dbService = {
  getAllRooms,
  getOneRoom,
  createRoom,
  renameRoom,
  deleteRoom,
  normalizeRoom,
  getMessages,
  createMessage,
};
