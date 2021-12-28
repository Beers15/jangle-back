'use strict';

const express = require('express');
const multer = require('multer');
const router = express.Router();
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });
const Profile = require('../models/profile');

const getAllProfiles = async (req, res) => {
  let allProfile = await Profile.find({});
  res.status(200).json(allProfile);
};

const getUserProfile = async (req, res) => {
  let profile = await Profile.find({ username: req.params.user });
  res.status(200).json(profile);
};

const createProfile = async (req, res) => {
  if (req.body.interests) {
    req.body.interests = req.body.interests.split(',');
  }
  if (req.file) {
    req.body.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } else delete req.body.image;

  try {
    let result = await Profile.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const updateProfile = async (req, res) => {
  req.body.interests = req.body.interests.split(',');
  if (req.file) {
    req.body.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } else delete req.body.image;

  try {
    let result = await Profile.findOneAndUpdate(
      { username: req.body.username },
      req.body,
      { new: true }
    );
    res.status(204).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const deleteProfile = async (req, res) => {
  let result = await Profile.deleteOne({ username: req.params.user });
  res.status(204).json(result);
};

//grabs a random user that is not the passed in user
const getRandomUser = async (req, res) => {
  let randomProfile = await Profile.count().then((count) => {
    return Profile.findOne({ username: { $ne: req.params.user } }).skip(
      Math.floor(Math.random() * count)
    );
  });

  res.status(200).json(randomProfile);
};

router
  .route('/')
  .get(getAllProfiles)
  .post(upload.single('image'), createProfile);

router
  .route('/:user')
  .get(getUserProfile)
  .put(upload.single('image'), updateProfile)
  .delete(deleteProfile);

router.route('/:user/random').get(getRandomUser);

module.exports = router;
