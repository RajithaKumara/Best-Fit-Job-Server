const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const jobModel = mongoose.model('job', {
  id: {
    type: Schema.ObjectId,
    required: true,
    index: true     //indexing
  },
  email: {
    type: String,
    required: true,
    index: true     //indexing
  },
  jobTitle: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  contacts: {
    type: Array
  },
  tags: {
    type: Array
  },
  url: {
    type: String,
    default: null
  },
  online: {
    type: Boolean,
    default: null
  },
  salary: {
    type: String,
    default: null
  },
  offers: {
    type: String,
    default: null
  },
  enable: {
    type: Boolean,
    default: true
  },
  privacy: {
    type: Boolean,
    default: false
  }
});

module.exports = jobModel;