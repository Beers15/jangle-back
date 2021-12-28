'use strict';

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomname: {
    type: String,
    unique: true,
    required: true,
  },
  users: [String],
  password: String,
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
