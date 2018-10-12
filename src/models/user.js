const jwt = require('jsonwebtoken');
const BSON = require('bson');
const { jwtSecretKeyAuth } = require('../data/data');
const DbConn = require('../config/database/mongooseConn');
const tempUserModel = require('../config/database/mongooseModels/tempUserModel');
const authUserModel = require('../config/database/mongooseModels/authUserModel');
const employerModel = require('../config/database/mongooseModels/employerModel');

class User {

  constructor() {
    this.dbConn = new DbConn();
  }

  /**Create temporary user by name and email. */
  register(_name, _email) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      let tempUser = new tempUserModel({
        name: _name,
        email: _email
      });

      tempUser.save().then((doc) => {
        console.log('DB_SUCCESS_TEMP_INSERT:', doc);
        this.dbConn.closeConnection(mongoose);

        return resolve(doc._id.toString());

      }).catch((error) => {
        console.log('DB_ERROR:', error.message);
        this.dbConn.closeConnection(mongoose);

        return reject(error);

      });
    });
  }

  /**Get temporary user name,email by id. */
  tempSignUp(_tempUserId, _tempUserToken) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      tempUserModel.findById(_tempUserId).then((tempUser) => {

        if (tempUser === null || tempUser === undefined) {
          this.dbConn.closeConnection(mongoose);

          let err = {
            code: 'USER_ERROR_TEMP_ID',
            message: 'Invalid user reqest.',
            status: 400
          };
          return reject(err);
        } else {
          authUserModel.findOne({ email: tempUser.email }, 'role').then((user) => {
            this.dbConn.closeConnection(mongoose);

            if (user === null || user === undefined) {
              console.log('DB_SUCCESS_TEMP_GET:', tempUser);
              let user = {
                _id: _tempUserToken,
                name: tempUser.name,
                email: tempUser.email,
              };
              console.log(user)
              return resolve(user);
            } else {
              let perUser = {
                email: tempUser.email,
                role: user.role
              }
              console.log('DB_SUCCESS_PER_GET:', perUser);
              return resolve(perUser);
            }
          }).catch((error) => {
            this.dbConn.closeConnection(mongoose);

            let err = {
              code: 'DB_ERROR_TEMP_ID',
              message: error.message,
              status: 500
            };
            return reject(err);

          });
        }
      }).catch((error) => {
        console.log('DB_ERROR:', error.message);
        this.dbConn.closeConnection(mongoose);

        let err = {
          code: 'DB_ERROR_TEMP_ID',
          message: error.message,
          status: 500
        };
        return reject(err);

      });
    });
  }

  /**Create permanent user. */
  signUp(u_id, _name, _email, _password, _role) {
    return new Promise((resolve, reject) => {
      let secret = BSON.ObjectID().toString();
      let token = jwt.sign({ id: u_id }, secret + jwtSecretKeyAuth);

      let mongoose = this.dbConn.getConnection();

      let newUser = new authUserModel({
        _id: u_id,
        name: _name,
        email: _email,
        password: _password,
        role: _role,
        tokens: [{ token, secret }]
      });

      newUser.save().then((doc) => {
        let user = {
          name: doc.name,
          email: doc.email,
          role: doc.role,
          token: token
        };

        console.log('DB_SUCCESS_AUTH_INSERT:', user);
        this.dbConn.closeConnection(mongoose);

        return resolve(user);

      }, (error) => {
        console.log('DB_ERROR:', error.message);
        this.dbConn.closeConnection(mongoose);
        let err = {
          code: 'DB_ERROR_STORE_AUTH_SIGNUP',
          message: error.message,
          status: 500
        };
        if (error.code == 11000) {
          err.message = 'Already created account for this email.';
          err.status = 400;
        }

        return reject(err);

      });
    });
  }

  /**User login. */
  login(_email) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      authUserModel.findOne({ email: _email }, (error, doc) => {
        this.dbConn.closeConnection(mongoose);

        if (error) {
          console.log('DB_ERROR:', error.message, ',email:', _email);
          return reject(error);

        } else {
          if (doc !== null) {
            console.log('DB_SUCCESS_AUTH_GET:', 'email:', doc.email);
            return resolve(doc);
          } else {
            let err = {
              code: 'DB_SUCCESS_AUTH_NULL',
              message: 'Please register and try again.',
              status: 400
            };
            console.log(err.code, ':', 'email:', _email);
            return reject(err);
          }
        }
      });
    });
  }

  pushToken(_id) {
    return new Promise((resolve, reject) => {
      let secret = BSON.ObjectID().toString();
      let token = jwt.sign({ _id }, secret + jwtSecretKeyAuth);

      let mongoose = this.dbConn.getConnection();

      authUserModel.findByIdAndUpdate(_id, {
        $push: {
          tokens: { token, secret }
        }
      }).then((doc) => {
        return resolve({ token, secret });
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  popToken(token) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      authUserModel.update({
        $pull: {
          tokens: { token }
        }
      }).then((doc) => {
        return resolve();
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  popAllTokens() {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();
    });
  }

  /**Get bulk of employers details. */
  getBulkEmployers(_ids) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      employerModel.find({ '_id': { $in: _ids } },
        '_id companyName companyUrl date companyEmail aboutCompany companySize companyType companyBuilding companyAddress companyCountry groups').then((docSet) => {

          this.dbConn.closeConnection(mongoose);

          return resolve(docSet);

        }).catch((error) => {
          this.dbConn.closeConnection(mongoose);
          let err = {
            code: 'DB_ERROR_GET_EMP',
            message: error.message,
            status: 500
          };
          return reject(err);

        });
    });

  }
}

module.exports = User;