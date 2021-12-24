'use strict';

const express = require('express');
const router = express.Router();

const Profile = require('../models/profile');

const getAllProfiles = async (req, res) => {
  let allProfile = await Profile.find({});
  res.status(200).json(allProfile);
}

const getUserProfile = async (req, res) => {
  console.log(req.params.user)
  let profile = await Profile.find({ username: req.params.user });
  res.status(200).json(profile);
}

const createProfile = async (req, res) => {
  try {
    let result = await Profile.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
}

const updateProfile = async (req, res) => {
  let result = await Profile.findOneAndUpdate({ username: req.params.user }, req.body);
  res.status(204).json(result);
}

const deleteProfile = async (req, res) => {
  let result = await Profile.deleteOne({ username: req.params.user });
  res.status(204).json(result);
}

//grabs a random user that is not the passed in user
const getRandomUser = async (req, res) => {
  let randomProfile = await Profile.count().then(count => {
    return Profile.findOne({username: { $ne: req.params.user }}).skip(Math.floor(Math.random() * count));
  });

  res.status(200).json(randomProfile);
}

router.route('/')
  .get(getAllProfiles)
  .post(createProfile);

router.route('/:user')
  .get(getUserProfile)
  .put(updateProfile)
  .delete(deleteProfile);

router.route('/:user/random')
  .get(getRandomUser)

module.exports = router;