'use strict';

const express = require('express');
const router = express.Router();

const Rooms = require('../models/rooms');

router.get('/', getAllRooms);
router.post('/', createRoom);
router.delete('/:id', deleteRoom);

async function getAllRooms(req, res) {
  let allRooms = await Rooms.find({});
  res.status(200).json(allRooms);
}

async function createRoom(req, res) {
  if(req.body.users) {
    let check1 = await Rooms.find({ roomname: req.body.users[0] + '-' + req.body.users[1] });
    let check2 = await Rooms.find({ roomname: req.body.users[1] + '-' + req.body.users[0] });
    
    if(check1.length > 0 || check2.length > 0) {
      return res.status(409).json({"err": "You already have an open direct message room with this user."});
    }
  }

  try {
    let result = await Rooms.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function deleteRoom(req, res) {
  let result = await Rooms.deleteOne({ id: req.params.id });
  res.status(201).json(result);
}

module.exports = router;
