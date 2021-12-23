'use strict';

const express = require('express');
const router = express.Router();

const Room = require('../models/room');

router.get('/', getAllRoom);
router.post('/', createRoom);
router.delete('/:id', deleteRoom);

async function getAllRoom(req, res) {
  let allRoom = await Room.find({});
  res.status(200).json(allRoom);
}

async function createRoom(req, res) {
  try {
    let result = await Room.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function deleteRoom(req, res) {
  let result = await Room.deleteOne({ id: req.params.id });
  res.status(204).json(result);
}

module.exports = router;