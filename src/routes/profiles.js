'use strict';

const express = require('express');
const router = express.Router();

const Profile = require('../models/profile');

router.get('/', getAllProfiles);
router.post('/', createProfile);

async function getAllProfiles(req, res) {
  let allProfile = await Profile.find({});
  res.status(200).json(allProfile);
}

async function createProfile(req, res) {
  try {
    let result = await Profile.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = router;