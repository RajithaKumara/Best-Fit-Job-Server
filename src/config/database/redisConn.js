const redis = require('redis');

class RedisConn {

  constructor() {

  }

  getConnection() {
    this.client = redis.createClient(process.env.REDIS_URL);
    this.client.on("error", function (err) {
      console.log("Redis_Error: ", err);
    });
    return this.client;
  }

  closeConnection(client){
    client.quit();
  }

}

module.exports = RedisConn;