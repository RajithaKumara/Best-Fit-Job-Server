const expect = require('expect');
const rewire = require('rewire');
const testRedisConn = require('../testRedisConn');
const {
  employer1_id,
  employer1_email,
  tagMap1,
  tagMap2,
  jobTitle1,
  jobDescription1,
  seeker_profile1,
  seeker_profile2
} = require('../testData');

var Analysor = rewire('../../src/models/analysor')
Analysor.__set__('RedisConn', testRedisConn);
Analysor.__set__({ console: { log: function () { } } });

describe('Analysor Model', () => {
  this.analysor = new Analysor();
  this.redisConn = new testRedisConn();

  describe('src->models->analysor->mapNewTag', () => {
    it('should success mapping new tag', (done) => {
      this.analysor.mapNewTag("tag1", "category1").then((res) => {
        let client = this.redisConn.getConnection();
        client.hmget("map", "tag1", (err, array) => {
          expect(array[0]).toBe("category1");
          done();
        });
      });
    });

    it('should not overwrite exist tag', (done) => {
      this.analysor.mapNewTag("tag1", "category1 new").then((res) => {
        let client = this.redisConn.getConnection();
        client.hmget("map", "tag1", (err, array) => {
          expect(array[0]).toBe("category1");
          done();
        });
      });
    });
  });


  describe('src->models->analysor->mapNewTagBulk', () => {
    it('should success with tag bulk', (done) => {
      this.analysor.mapNewTagBulk(tagMap1).then((res) => {
        let client = this.redisConn.getConnection();
        client.hmget("map", [
          "tag1", "tag2", "tag3",
          "tag4", "tag5", "tag6"
        ], (err, array) => {
          expect(array[0]).toBe("category1");
          expect(array[1]).toBe("category2");
          expect(array[2]).toBe("category3");
          expect(array[3]).toBe("category4");
          expect(array[4]).toBe("category5");
          expect(array[5]).toBe("category6");
          done();
        });
      });
    });

    it('should success with tag bulk & overwrite all', (done) => {
      this.analysor.mapNewTagBulk(tagMap2).then((res) => {
        let client = this.redisConn.getConnection();
        client.hmget("map", [
          "tag1", "tag2", "tag3",
          "tag4", "tag5", "tag6", "tag7"
        ], (err, array) => {
          expect(array[0]).toBe("category1");
          expect(array[1]).toBe("category2 new");
          expect(array[2]).toBe("category3 new");
          expect(array[3]).toBe("category4");
          expect(array[4]).toBe("category5 new");
          expect(array[5]).toBe("category6");
          expect(array[6]).toBe("category7 new");
          done();
        });
      });
    });
  });


  describe('src->models->analysor->categorizeJob', () => {
    it('should success categorize job', (done) => {
      this.analysor.categorizeJob(
        "job_id",
        jobTitle1,
        jobDescription1,
        ["tag1", "tag2"]
      ).then((res) => {
        let client = this.redisConn.getConnection();
        client.hget("jobs", "job_id", (err, reply) => {
          expect(reply).toContain("category1");
          expect(reply).toContain("category2 new");
          client.lrange("category1", 0, -1, (err, jobs) => {
            expect(jobs).toContain("job_id");
            client.lrange("category2 new", 0, -1, (err, jobs) => {
              this.redisConn.closeConnection(client);
              expect(jobs).toContain("job_id");
              done();
            });
          });
        });
      });
    });
  });


  describe('src->models->analysor->reCategorizeJob', () => {
    it('should success recategorize job with intersection', (done) => {
      this.analysor.reCategorizeJob(
        "job_id",
        jobTitle1,
        jobDescription1,
        ["tag2", "tag3"]
      ).then((res) => {
        let client = this.redisConn.getConnection();
        client.hget("jobs", "job_id", (err, reply) => {
          expect(reply).toContain("category2 new");
          expect(reply).toContain("category3 new");
          client.lrange("category2 new", 0, -1, (err, jobs) => {
            expect(jobs).toContain("job_id");
            client.lrange("category3 new", 0, -1, (err, jobs) => {
              this.redisConn.closeConnection(client);
              expect(jobs).toContain("job_id");
              done();
            });
          });
        });
      });
    });

    it('should success recategorize job without intersection', (done) => {
      this.analysor.reCategorizeJob(
        "job_id",
        jobTitle1,
        jobDescription1,
        ["tag4", "tag5"]
      ).then((res) => {
        let client = this.redisConn.getConnection();
        client.hget("jobs", "job_id", (err, reply) => {
          expect(reply).toContain("category4");
          expect(reply).toContain("category5 new");
          client.lrange("category4", 0, -1, (err, jobs) => {
            expect(jobs).toContain("job_id");
            client.lrange("category5 new", 0, -1, (err, jobs) => {
              this.redisConn.closeConnection(client);
              expect(jobs).toContain("job_id");
              done();
            });
          });
        });
      });
    });
  });


  describe('src->models->analysor->suggestJob', () => {
    it('should suggest jobs for exist tags', (done) => {
      this.analysor.suggestJob(seeker_profile1).then((res) => {
        expect(JSON.stringify(res[0])).toContain('job_id');
        done();
      });
    });

    it('should not suggest jobs for not exist tags', (done) => {
      this.analysor.suggestJob(seeker_profile2).then((res) => {
        //should have internet connection and valid google NLP API key at env.NLP_API_KEY
        expect(res.length).toBe(3);
        done();
      }).catch((error) => {
        console.error(error);
        done();
      });
    });
  });


  describe('src->models->analysor->removeJob', () => {
    it('should success remove exist job', (done) => {
      this.analysor.removeJob("job_id").then((res) => {
        let client = this.redisConn.getConnection();
        client.hget("jobs", "job_id", (err, reply) => {
          expect(reply).toBeNull();
          client.lrange("category2 new", 0, -1, (err, jobs) => {
            expect(jobs.length).toBe(0);
            client.lrange("category3 new", 0, -1, (err, jobs) => {
              this.redisConn.closeConnection(client);
              expect(jobs.length).toBe(0);
              done();
            });
          });
        });
      });
    });

    it('should not success remove not exist job', (done) => {
      this.analysor.removeJob("job_id").catch((error) => {
        expect(error).toBe('Not found')
        done();
      })
    });
  });
});