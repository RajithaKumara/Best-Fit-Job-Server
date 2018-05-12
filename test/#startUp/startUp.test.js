const mongoose = require('mongoose');
const redis = require('redis');
const request = require('request');
const rewire = require('rewire');
const testDbConn = require('../testMongooseConn');
const tempUserModel = require('../../src/config/database/mongooseModels/tempUserModel');
const {
  mongoDbLocalURI,
  redisDbLocalURI,
  pingURL,
  tempUser_id,
  tempUser_email,
  seeker1_id,
  seeker1_email,
  seeker3_id,
  seeker3_email,
  employer1_id,
  employer1_email,
  employer3_id,
  employer3_email
} = require('../testData');

var mongoDbSuccess = false;
var redisSuccess = false;
var internetSuccess = false;

var User = rewire('../../src/models/user')
User.__set__('DbConn', testDbConn);
User.__set__({ console: { log: function () { } } });
this.user = new User();


it('mongooseConn', (done) => {
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_URI || mongoDbLocalURI).then((conn) => {
    mongoDbSuccess = true;
    done();
  }).catch((error) => {
    console.log("\n==============================");
    console.log('\x1b[31m%s\x1b[0m', " MongoDB connectivity failed. ");
    console.log("==============================\n");
    process.exit(13);
  });
});

it('redisConn', (done) => {
  this.client = redis.createClient(process.env.REDIS_URL || redisDbLocalURI);
  this.client.on("error", (err) => {
    console.log("\n============================");
    console.log('\x1b[31m%s\x1b[0m', " Redis connectivity failed. ");
    console.log("============================\n");
    process.exit(13);
  });
  redisSuccess = true;
  done();
});

it('internetConn', (done) => {
  request({
    url: pingURL,
    method: 'GET',
    timeout: 2000
  }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      internetSuccess = true;
      done();
    } else {
      console.log("\n===============================");
      console.log('\x1b[31m%s\x1b[0m', " Internet connectivity failed. ");
      console.log("===============================\n");
      process.exit(13);
    }
  });
});

it('mongooseConn & redisConn & internetConn', () => {
  if (!mongoDbSuccess || !redisSuccess || !internetSuccess) {
    console.log("\n============================================");
    console.log('\x1b[31m%s\x1b[0m', " Database or Internet connectivity timeout. ");
    console.log("============================================\n");
    process.exit(13);
  }
});

it('dummy data inserting', (done) => {
  let promiseArray = [];
  promiseArray.push(this.user.signUp(
    seeker1_id,
    "Seeker1 Name",
    seeker1_email,
    "password",
    "seeker"
  ));

  promiseArray.push(this.user.signUp(
    seeker3_id,
    "Seeker3 Name",
    seeker3_email,
    "password",
    "seeker"
  ));

  promiseArray.push(this.user.signUp(
    employer1_id,
    "Employer1 Name",
    employer1_email,
    "password",
    "employer"
  ));

  promiseArray.push(this.user.signUp(
    employer3_id,
    "Employer3 Name",
    employer3_email,
    "password",
    "employer"
  ));

  let tempUser = new tempUserModel({
    _id: tempUser_id,
    name: "temp user name",
    email: tempUser_email
  });
  promiseArray.push(tempUser.save());

  Promise.all(promiseArray).then(() => {
    done();
    console.log("\n")
  }).catch((error) => {
    done();
    console.log("\n")
  })
});
