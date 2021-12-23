'use strict';

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  roomname: {
    type: String,
  },
  timeSent: {
    type: Date,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  preferredName: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
