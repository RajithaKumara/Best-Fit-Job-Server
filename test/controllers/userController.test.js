const expect = require('expect');
const rewire = require('rewire');
const jwt = require('jsonwebtoken');
const testDbConn = require('../testMongooseConn');
const authUserModel = require('../../src/config/database/mongooseModels/authUserModel');
const {
  tempUser_id,
  tempUser_email,
  seeker1_id,
  seeker1_email
} = require('../testData');
const { jwtSecretKeySign } = require('../../src/data/data');

var User = rewire('../../src/models/user')
User.__set__('DbConn', testDbConn);
User.__set__({ console: { log: function () { } } });

var Job = rewire('../../src/models/job')
Job.__set__('DbConn', testDbConn);
Job.__set__({ console: { log: function () { } } });

var UserController = rewire('../../src/controllers/userController');
UserController.__set__({
  User: User,
  Job: Job,
  console: { log: function () { } }
});

describe('User Controller', () => {
  this.userController = new UserController();

  describe('src->controllers->userController->tempUserSignUp', () => {
    it('should success get temporary user data with valid id', (done) => {
      let userToken = jwt.sign({ userId: tempUser_id }, jwtSecretKeySign);
      this.userController.tempUserSignUp(userToken).then((res) => {
        expect(res._id.toString()).toBe(userToken);
        expect(res.email).toBe(tempUser_email);
        done();
      });
    });

    it('should not success get temporary user data with invalid id', (done) => {
      this.userController.tempUserSignUp("invalid_id").catch((error) => {
        expect(error.code).toBe("UC_ERROR_TEMP_SIGNUP");
        done();
      });
    });
  });


  describe('src->controllers->userController->userSignUp', () => {
    it('should not success sign up user with invalid id', (done) => {
      this.userController.userSignUp({
        userId: "invalid_id",
        userEmail: tempUser_email,
        userPassword: "password",
        userRole: "seeker"
      }).catch((error) => {
        expect(error.code).toBe('UC_ERROR_SIGNUP_VALIDATION');
        done();
      });
    });

    it('should not success sign up user with invalid email', (done) => {
      let userToken = jwt.sign({ userId: tempUser_id }, jwtSecretKeySign);
      this.userController.userSignUp({
        userId: userToken,
        userEmail: "invalid_email",
        userPassword: "password",
        userRole: "seeker"
      }).catch((error) => {
        expect(error.code).toBe('UC_ERROR_SIGNUP_VALIDATION');
        done();
      });
    });

    it('should not success sign up user with invalid role', (done) => {
      let userToken = jwt.sign({ userId: tempUser_id }, jwtSecretKeySign);
      this.userController.userSignUp({
        userId: userToken,
        userEmail: tempUser_email,
        userPassword: "password",
        userRole: "invalid_role"
      }).catch((error) => {
        expect(error.code).toBe('DB_ERROR_STORE_AUTH_SIGNUP');
        done();
      });
    });

    it('should success sign up user with valid id', (done) => {
      let userToken = jwt.sign({ userId: tempUser_id }, jwtSecretKeySign);
      this.userController.userSignUp({
        userId: userToken,
        userEmail: tempUser_email,
        userPassword: "password",
        userRole: "seeker"
      }).then((res) => {
        expect(res.name).toBe('temp user name');
        expect(res.email).toBe(tempUser_email);
        expect(res.role).toBe('seeker');
        done();
      });
    });
  });


  describe('src->controllers->userController->login', () => {
    it('should success with registered email with correct password', (done) => {
      this.userController.userLogin({
        userEmail: tempUser_email,
        userPassword: 'password'
      }).then((res) => {
        expect(res.email).toBe(tempUser_email);
        expect(res.name).toBe('temp user name');
        expect(res.role).toBe('seeker');
        done();
      });
    });

    it('should not success with registered email with incorrect password', (done) => {
      this.userController.userLogin({
        userEmail: tempUser_email,
        userPassword: 'wrong_password'
      }).catch((error) => {
        expect(error.code).toBe('UC_ERROR_LOGIN_INVALID_PASSWORD');
        done();
      });
    });

    it('should not success with invalid email', (done) => {
      this.userController.userLogin({
        userEmail: 'invalid_email',
        userPassword: 'password'
      }).catch((error) => {
        expect(error.code).toBe('UC_ERROR_LOGIN_VALIDATION');
        done();
      });
    });

    it('should not success with unregistered email', (done) => {
      this.userController.userLogin({
        userEmail: 'not.registered.email@domain.com',
        userPassword: 'password'
      }).catch((error) => {
        expect(error.code).toBe('DB_SUCCESS_AUTH_NULL');
        done();
      });
    });
  });


  it('delete auth user if exists', (done) => {
    let dbConn = new testDbConn();
    let mongoose = dbConn.getConnection();
    authUserModel.remove({ '_id': tempUser_id }).then((res) => {
      done();
    });
  });
});