const User = require('../models/user');
const Job = require('../models/job');
const Validator = require('../models/validator');
const request = require('request');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { mailerURL, mailerKey, jwtSecretKeySign } = require('../data/data');

class UserController {

  constructor() {
    this.user = new User();
    this.job = new Job();
    this.validator = new Validator();
  }

  /**User registration start with name and email. And verification email send here. */
  userRegister(data) {
    return new Promise((resolve, reject) => {
      let userName = data.userName;
      let userEmail = data.userEmail;
      //data validation
      if (!this.validator.isName(userName) || !this.validator.isEmail(userEmail)) {
        let err = {
          code: 'UC_ERROR_REGISTER_VALIDATION',
          message: 'User name or email not valid.',
          status: 400
        };
        //console.log(err.code, ':', err.message, ',email:', userEmail);
        return reject(err);
      }
      //store temp user and send email
      else {
        this.user.register(userName, userEmail).then((userId) => {
          let userToken = jwt.sign({ userId }, jwtSecretKeySign);
          this.sendVerificationEmail(userName, userEmail, userToken).then(() => {
            let success = {
              code: 'UC_SUCCESS_REGISTER_EMAIL',
              message: 'Email send successfully.',
              status: 200
            };
            //console.log(success.code, ':', success.message, ',email:', userEmail);
            return resolve(success);
          }).catch((error) => {
            let err = {
              code: 'UC_ERROR_REGISTER_EMAIL',
              message: 'Email sending error.',
              status: 500
            };
            //console.log(err.code, ':', err.message, ',email:', userEmail);
            return reject(err);
          });
        }).catch((error) => {
          let err = {
            code: 'UC_ERROR_REGISTER_STORE',
            message: 'User data storing error.',
            status: 500
          };
          //console.log(err.code, ':', err.message, ',email:', userEmail);
          return reject(err);
        });
      }
    });
  }

  /**Identify temporary user come from verification email. */
  tempUserSignUp(tempUserToken) {
    return new Promise((resolve, reject) => {
      //data validation
      let tempUserId = "";
      try {
        let decoded = jwt.verify(tempUserToken, jwtSecretKeySign);
        tempUserId = decoded.userId;
      } catch (e) { }
      if (!this.validator.isValidObjectID(tempUserId)) {
        let err = {
          code: 'UC_ERROR_TEMP_SIGNUP',
          message: 'Invalid user id.',
          status: 400
        };
        //console.log(err.code, ':', err.message, ',_id:', tempUserId);
        return reject(err);
      }
      //find tempuser by id
      else {
        this.user.tempSignUp(tempUserId,tempUserToken).then((user) => {
          //console.log('UC_SUCCESS_TEMP_SIGNUP:', user);
          return resolve(user);
        }).catch((error) => {
          console, log('UC_ERROR_TEMP_SIGNUP:', error.message);
          return reject(error);
        });
      }
    });
  }

  /**User sign up permanently by email and password. */
  userSignUp(user) {
    let userToken = user.userId;
    let userEmail = user.userEmail;

    return new Promise((resolve, reject) => {
      //data validation
      let userId = "";
      try {
        let decoded = jwt.verify(userToken, jwtSecretKeySign);
        userId = decoded.userId;
      } catch (e) { }
      if (!this.validator.isValidObjectID(userId) || !this.validator.isEmail(userEmail)) {
        let err = {
          code: 'UC_ERROR_SIGNUP_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        };
        //console.log(err.code, ':', err.message, ',email:', userEmail);
        return reject(err);
      }
      else {
        //find tempuser by id
        this.user.tempSignUp(userId).then((doc) => {
          let userPassword = user.userPassword;
          let userRole = user.userRole;

          //check is there any conflicts of user data and db data
          if (doc.email.toString() == userEmail.toString()) {
            this.getHash(userPassword).then((hash) => {
              this.user.signUp(userId, doc.name.toString(), userEmail, hash, userRole).then((user) => {
                //console.log('UC_SUCCESS_SIGNUP:', user);
                return resolve(user);
              }).catch((error) => {
                //console.log('UC_ERROR:', error.message, ',_id:', userId);
                return reject(error);
              });
            }).catch((error) => {
              //console.log('UC_ERROR:', error.message, ',_id:', userId);
              return reject(error);
            });

          } else {
            let err = {
              code: 'UC_SIGNUP_VALIDATION',
              message: 'User details are mismatch.',
              status: 400
            };
            return reject(err);
          }
        }).catch((error) => {
          let err = {
            code: 'UC_ERROR_TEMP_USER_GET',
            message: error.message,
            status: error.status
          };
          //console.log(err.code, ':', err.message, ',_id:', userId);
          return reject(err);
        })

      }
    });
  }

  userLogin(data) {
    return new Promise((resolve, reject) => {
      let userPassword = data.userPassword;
      let userEmail = data.userEmail;

      if (!this.validator.isEmail(userEmail)) {
        let err = {
          code: 'UC_ERROR_LOGIN_VALIDATION',
          message: 'Invalid email address.',
          status: 400
        };
        //console.log(err.code, ':', err.message, ',email:', userEmail);
        return reject(err);
      } else {
        this.user.login(userEmail).then((doc) => {
          this.compareHash(userPassword, doc.password).then((passwordsMatch) => {
            if (passwordsMatch) {

              //console.log('UC_SUCCESS_LOGIN:', user);
              this.user.pushToken(doc._id).then((token) => {
                let user = {
                  name: doc.name,
                  email: doc.email,
                  role: doc.role,
                  profile: doc.profile,
                  token: token.token
                };
                return resolve(user);

              }).catch((error) => {
                let err = {
                  code: 'UC_ERROR_TOKEN_STORE',
                  message: 'Token store error',
                  status: 500
                };
                return reject(err);

              });
            } else {
              let err = {
                code: 'UC_ERROR_LOGIN_INVALID_PASSWORD',
                message: 'User password is wrong.',
                status: 400
              };
              //console.log(err.code, ':', err.message, ',email:', userEmail);
              return reject(err);
            }
          }).catch((error) => {
            //console.log('UC_ERROR_LOGIN:', error.message, ',email:', userEmail);
            return reject(error);
          });
        }).catch((error) => {
          //console.log('UC_ERROR_LOGIN:', error.message, ',email:', userEmail);
          return reject(error);
        });
      }

    });
  }

  userLogout(data) {
    let token = data.userToken;
    return new Promise((resolve, reject) => {
      if (token != null || token != undefined) {
        this.user.popToken(token).then(() => {
          return resolve();
        }).catch((error) => {
          return reject();
        });
      } else {
        return reject();
      }
    });
  }

  /**Search public job opportunities. */
  userSearchJobs(data) {
    let keyWords = data.data;

    return new Promise((resolve, reject) => {
      //data validation
      if (typeof keyWords != 'string') {
        let err = {
          code: 'UC_ERROR_SEARCH_VALIDATION',
          message: 'Invalid keyword.',
          status: 400
        }
        return reject(err);
      }
      else {
        //search job opportunities
        this.job.getPublicJobsByAll(keyWords).then((resultsArray) => {
          let allJobs = [];
          resultsArray.forEach((item, index) => {
            allJobs = allJobs.concat(item);
          });

          let newJobArray = [];
          let jobIds = [];
          let employerIds = [];

          allJobs.forEach((item, index) => {
            if (!jobIds.includes(item._id.toString())) {
              jobIds.push(item._id.toString());
              newJobArray.push(item);
              employerIds.push(item.id);
            }
          });

          //if no result found return empty array
          if (newJobArray.length === 0) {
            return resolve([]);
          }

          //if job results found then search company details for particular job
          this.user.getBulkEmployers(employerIds).then((companyArray) => {
            return resolve([newJobArray, companyArray]);
          }).catch((error) => {
            return reject(error);

          });

        }).catch((error) => {
          return reject(error);

        });
      }
    });
  }

  /**Send verification email using php mail server. */
  sendVerificationEmail(userName, userEmail, userId) {
    return new Promise((resolve, reject) => {
      request({
        url: mailerURL,
        method: 'POST',
        form: {
          userName: userName,
          userEmail: userEmail,
          userId: userId,
          authKey: mailerKey
        },
        timeout: 3000
      }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          //console.log("PHP_SERVER_RESPONSE:{", body, "}");
          return resolve();
        } else {
          //console.log("PHP_SERVER_ERROR:", error.message, ",email:", userEmail);
          return reject(error);
        }
      });
    });
  }

  /**Return hashed password. */
  getHash(password) {
    return new Promise((resolve, reject) => {
      const saltRound = 10;
      bcrypt.hash(password, saltRound).then((hash) => {
        return resolve(hash);
      }).catch((error) => {
        return reject(error);
      });
    });

  }

  /**Compare hashed password with palin text password. */
  compareHash(password, hashed) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashed).then((res) => {
        return resolve(res);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

}

module.exports = UserController;