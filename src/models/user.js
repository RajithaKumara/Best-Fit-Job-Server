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
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        resolve(doc._id.toString());

      }).catch((error) => {
        console.log('DB_ERROR:', error.message);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        reject(error);

      });
    });
  }

  /**Get temporary user name,email by id. */
  tempSignUp(_tempUserId) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      tempUserModel.findById(_tempUserId).then((tempUser) => {

        if (tempUser === null || tempUser === undefined) {
          try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

          let err = {
            code: 'USER_ERROR_TEMP_ID',
            message: 'Invalid user reqest.',
            status: 400
          };
          reject(err);
        } else {
          authUserModel.findOne({ email: tempUser.email }, 'role').then((user) => {
            try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

            if (user === null || user === undefined) {
              console.log('DB_SUCCESS_TEMP_GET:', tempUser);
              resolve(tempUser);
            } else {
              let perUser = {
                email: tempUser.email,
                role: user.role
              }
              console.log('DB_SUCCESS_PER_GET:', perUser);
              resolve(perUser);
            }
          }).catch((error) => {
            try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

            let err = {
              code: 'DB_ERROR_TEMP_ID',
              message: error.message,
              status: 500
            };
            reject(err);

          });
        }
      }).catch((error) => {
        console.log('DB_ERROR:', error.message);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        let err = {
          code: 'DB_ERROR_TEMP_ID',
          message: error.message,
          status: 500
        };
        reject(err);

      });
    });
  }

  /**Create permanent user. */
  signUp(u_id, _name, _email, _password, _role) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      let newUser = new authUserModel({
        _id: u_id,
        name: _name,
        email: _email,
        password: _password,
        role: _role
      });

      newUser.save().then((doc) => {
        let user = {
          id: doc._id.toString(),
          name: doc.name,
          email: doc.email,
          role: doc.role
        };

        console.log('DB_SUCCESS_AUTH_INSERT:', user);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        resolve(user);

      }, (error) => {
        console.log('DB_ERROR:', error.message);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }
        let err = {
          code: 'DB_ERROR_STORE_AUTH_SIGNUP',
          message: error.message,
          status: 500
        };
        if (error.code == 11000) {
          err.message = 'Already created account for this email.';
          err.status = 400;
        }

        reject(err);

      });
    });
  }

  /**User login. */
  login(_email) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      authUserModel.findOne({ email: _email }, (error, doc) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        if (error) {
          console.log('DB_ERROR:', error.message, ',email:', _email);
          reject(error);

        } else {
          if (doc !== null) {
            console.log('DB_SUCCESS_AUTH_GET:', 'email:', doc.email);
            resolve(doc);
          } else {
            let err = {
              code: 'DB_SUCCESS_AUTH_NULL',
              message: 'Please register and try again.',
              status: ''
            };
            console.log(err.code, ':', 'email:', _email);
            reject(err);
          }
        }
      });
    });
  }

  /**Get bulk of employers details. */
  getBulkEmployers(_ids) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      console.log(_ids)

      employerModel.find({ '_id': { $in: _ids } },
        '_id companyName companyUrl date companyEmail aboutCompany companySize companyType companyBuilding companyAddress companyCountry groups').then((docSet) => {

          try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

          resolve(docSet);

        }).catch((error) => {
          try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }
          let err = {
            code: 'DB_ERROR_GET_EMP',
            message: error.message,
            status: 500
          };
          reject(err);

        });
    });

  }
}

module.exports = User;