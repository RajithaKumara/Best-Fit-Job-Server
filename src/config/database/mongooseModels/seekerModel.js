const mongoose = require('mongoose');

const seekerModel = mongoose.model('seeker', {
  email: {
    type: String,
    required: true,
    unique: true,    //email should be unique
    index: true     //indexing
  },
  general: {
    type: JSON,
    required: true
  },
  contacts: {
    type: Array
  },
  experience: {
    type: Array
  },
  education: {
    type: Array
  },
  ksao: { //knowledge,skills,attitudes,other attributes
    type: Array
  },
  extra: {
    type: Array
  },
  tags: {
    type: Array
  },
  privacy: {
    type: Boolean,
    default: false
  },
});

module.exports = seekerModel;