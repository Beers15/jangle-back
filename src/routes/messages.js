'use strict';

const express = require('express');
const router = express.Router();

const Message = require('../models/message');

const getRoomMessages = async (req, res) => {
  let allMessages = await Message.find({ roomname: req.params.room });
  res.status(200).json(allMessages);
}

const addMessage = async (req, res) => {
  let msg = req.body;	
  let current = new Date();
  let date = `${current.getFullYear()}/${(current.getMonth() + 1)}/${current.getDate()}`;
  let time = `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
  msg.timeSentFormatted =  `${date} ~ ${time}`;
  msg.timeSent = current;

  try {
    let result = await Message.create(msg);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
}

router.route('/')
  .post(addMessage);

router.route('/:room')
  .get(getRoomMessages);

module.exports = router;
