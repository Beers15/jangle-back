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
