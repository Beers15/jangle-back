'use strict';

const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

const roomSchema = new mongoose.Schema({
  roomname: {
    type: String,
    unique: true,
    required: true,
  },
  password: String, //temp
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;