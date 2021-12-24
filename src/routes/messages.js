'use strict';

const express = require('express');
const router = express.Router();

const Message = require('../models/message');

const getRoomMessages = async (req, res) => {
  let allMessages = await Message.find({ roomname: req.params.room });
  res.status(200).json(allMessages);
}

router.route('/:room')
  .get(getRoomMessages);

module.exports = router;
