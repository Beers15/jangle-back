'use strict';

const mongoose = require('mongoose');

const options = { toJSON: { virtuals: true } };

const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200');
});

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  image: ImageSchema,
  preferredName: {
    type: String,
  },
  interests: {
    type: [String],
  },
  bio: {
    type: String,
    required: true,
  }
}, options);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
