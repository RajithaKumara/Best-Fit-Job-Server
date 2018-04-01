const mongoose = require('mongoose');

class DbConn {
  
  constructor() {
    mongoose.Promise = global.Promise;
  }

  getConnection(){
    mongoose.connect(process.env.MONGODB_URI);
    return mongoose;
  }

  closeConnection(mongoose){
    mongoose.disconnect();
  }
}

module.exports = DbConn;