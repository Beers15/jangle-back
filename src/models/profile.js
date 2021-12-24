'use strict';

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  preferredName: {
    type: String,
  },
  interests: {
    type: [String],
  },
  bio: {
    type: String,
    required: true,
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
