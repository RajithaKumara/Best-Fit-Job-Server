const mongoose = require('mongoose');

const authUserSchema = new mongoose.Schema({
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
  tokens: {
    type: Array,
    index: true     //indexing
  }
});

authUserSchema.statics.findByToken = function (token) {
  return this.findOne({
    'tokens.token':token
  },'_id role email');
}

const authUserModel = mongoose.model('authUser', authUserSchema);

module.exports = authUserModel;