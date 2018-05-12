const expect = require('expect');
const rewire = require('rewire');
const testDbConn = require('../testMongooseConn');
const authUserModel = require('../../src/config/database/mongooseModels/authUserModel');
const { tempUser_id } = require('../testData');

var User = rewire('../../src/models/user')
User.__set__('DbConn', testDbConn);
User.__set__({ console: { log: function () { } } });

describe('User Model', () => {
  this.user = new User();

  this.testTempUserId = '';

  describe('src->models->user->register', () => {
    it('should register with name & email', (done) => {
      this.user.register("First Last Name", "email@domain.com").then((id) => {
        this.testTempUserId = id;
        done();
      });
    });

    it('should not register only with name', (done) => {
      this.user.register("First Last Name", "").catch((error) => {
        expect(error.name).toBe("ValidationError")
        done();
      });
    });

    it('should not register only with email', (done) => {
      this.user.register("", "email@domain.com").catch((error) => {
        expect(error.name).toBe("ValidationError")
        done();
      });
    });
  });


  describe('src->models->user->tempSignUp', () => {
    it('should success with valid id', (done) => {
      this.user.tempSignUp(this.testTempUserId).then((doc) => {
        try {
          expect(doc._id.toString()).toBe(this.testTempUserId);
          expect(doc.name).toBe("First Last Name");
        } catch (e) {
          expect(doc.role).toBe("seeker");
        } finally {
          expect(doc.email).toBe("email@domain.com");
          done();
        }
      });
    });

    it('should not success with invalid id', (done) => {
      this.user.tempSignUp("").catch((error) => {
        expect(error.code).toBe("DB_ERROR_TEMP_ID");
        done();
      });
    });
  });


  describe('src->models->user->signUp', () => {
    it('should success signUp with valid data', (done) => {
      this.user.signUp(
        this.testTempUserId,
        "First Last Name",
        "email@domain.com",
        "password",
        "seeker"
      ).then((doc) => {
        expect(doc.id.toString()).toBe(this.testTempUserId);
        expect(doc.name).toBe("First Last Name");
        expect(doc.email).toBe("email@domain.com");
        expect(doc.role).toBe("seeker");
        done();
      }).catch((error) => {
        expect(error.message).toBe("Already created account for this email.");
        done();
      });
    });

    it('should not success signUp with same email', (done) => {
      this.user.signUp(
        this.testTempUserId,
        "First Last Name",
        "email@domain.com",
        "password",
        "seeker"
      ).catch((error) => {
        expect(error.message).toBe("Already created account for this email.");
        done();
      });
    });

    it('should not success signUp without name', (done) => {
      this.user.signUp(
        this.testTempUserId,
        "",
        "email@domain.com",
        "password",
        "seeker"
      ).catch((error) => {
        expect(error.message).toContain('`name` is required.');
        done();
      });
    });

    it('should not success signUp without email', (done) => {
      this.user.signUp(
        this.testTempUserId,
        "First Last Name",
        "",
        "password",
        "seeker"
      ).catch((error) => {
        expect(error.message).toContain('`email` is required.');
        done();
      });
    });

    it('should not success signUp without password', (done) => {
      this.user.signUp(
        this.testTempUserId,
        "First Last Name",
        "email@domain.com",
        "",
        "seeker"
      ).catch((error) => {
        expect(error.message).toContain('`password` is required.');
        done();
      });
    });

    it('should not success signUp without role', (done) => {
      this.user.signUp(
        this.testTempUserId,
        "First Last Name",
        "email@domain.com",
        "password",
        ""
      ).catch((error) => {
        expect(error.message).toContain('`role` is required.');
        done();
      });
    });

    it('should not success signUp invalid role', (done) => {
      this.user.signUp(
        this.testTempUserId,
        "First Last Name",
        "email@domain.com",
        "password",
        "role"
      ).catch((error) => {
        expect(error.message).toContain('is not a valid enum value for path `role`.');
        done();
      });
    });
  });


  describe('src->models->user->login', () => {
    it('should success login with registered email', (done) => {
      this.user.login("email@domain.com").then((doc) => {
        expect(doc.name).toBe("First Last Name");
        expect(doc.email).toBe("email@domain.com");
        expect(doc.role).toBe("seeker");
        done();
      });
    });

    it('should not success login with unregistered email', (done) => {
      this.user.login("unreg.email@domain.com").catch((error) => {
        expect(error.code).toContain('DB_SUCCESS_AUTH_NULL');
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