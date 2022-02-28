'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Message = require('../models/message');
const getKey = require('../helpers/getKey');
const getToken = require('../helpers/getToken');

const getRoomMessages = async (req, res) => {
  const token = getToken(req);

  jwt.verify(token, getKey, {}, async (err) => {
    if (err || !token) {
      token ? res.status(500).send(err) : res.status(401).send(err);
    } else {
      let allMessages = await Message.find({ roomname: req.params.room });
      res.status(200).json(allMessages);
    }
  });
};

router.route('/:room').get(getRoomMessages);

module.exports = router;
