'use strict';

const express = require('express');
const router = express.Router();

const Room = require('../models/room');

const getAllRoom = async (req, res) => {
  let allRoom = await Room.find({});
  res.status(200).json(allRoom);
}

const createRoom = async (req, res) => {
  try {
    let result = await Room.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
}

const deleteRoom = async (req, res) => {
  let result = await Room.deleteOne({ id: req.params.id });
  res.status(204).json(result);
}

router.route('/')
  .get(getAllRoom)
  .post(createRoom);

router.route('/:id')
  .delete(deleteRoom);

module.exports = router;