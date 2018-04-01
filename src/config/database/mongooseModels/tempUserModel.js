const mongoose = require('mongoose');

const tempUserModel = mongoose.model('tempUser', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    index: true     //indexing
  }
});

module.exports = tempUserModel;