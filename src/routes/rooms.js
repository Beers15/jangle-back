'use strict';

const express = require('express');
const router = express.Router();

const Room = require('../models/room');

const getAllRoom = async (req, res) => {
  let allRoom = await Room.find({});
  res.status(200).json(allRoom);
};

const createRoom = async (req, res) => {
  if (req.body.users) {
    let check1 = await Room.find({
      roomname: req.body.users[0] + '-' + req.body.users[1],
    });
    let check2 = await Room.find({
      roomname: req.body.users[1] + '-' + req.body.users[0],
    });

    if (check1.length > 0 || check2.length > 0) {
      return res.status(409).json({
        err: 'You already have an open direct message room with this user.',
      });
    }
  }

  try {
    let result = await Room.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteRoom = async (req, res) => {
  let result = await Room.deleteOne({ id: req.params.id });
  res.status(204).json(result);
};

router.route('/').get(getAllRoom).post(createRoom);

router.route('/:id').delete(deleteRoom);

module.exports = router;
