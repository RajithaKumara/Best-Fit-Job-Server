const mongoose = require('mongoose');
const { mongoDbLocalURI } = require('./testData');

class DbConn {

  constructor() {
    mongoose.Promise = global.Promise;
  }

  getConnection() {
    mongoose.connect(mongoDbLocalURI);
    return mongoose;
  }

  closeConnection(mongoose) {

  }
}

module.exports = DbConn;