const redis = require('redis');
const { redisDbLocalURI } = require('./testData');

class RedisConn {

  constructor() {

  }

  getConnection() {
    this.client = redis.createClient(redisDbLocalURI);
    this.client.on("error", function (err) {
      console.log("Redis_Error: ", err);
    });
    this.client.select(1);
    return this.client;
  }

  closeConnection(client) {
    try {
      client.quit();
    } catch (e) {
      console.log(e);
    }
  }

}

module.exports = RedisConn;