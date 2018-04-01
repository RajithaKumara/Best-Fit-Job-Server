const mongoose = require('mongoose');

const authUserModel = mongoose.model('authUser', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,    //email should be unique
    index: true     //indexing
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['seeker', 'employer'],
    required: true
  },
  profile: {
    type: String
  },
});

module.exports = authUserModel;