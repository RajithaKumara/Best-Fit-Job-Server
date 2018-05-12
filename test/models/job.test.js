const expect = require('expect');
const rewire = require('rewire');
const testDbConn = require('../testMongooseConn');
const {
  employer1_id,
  employer1_email,
  job1,
  job1_updated,
  job2
} = require('../testData');

var Job = rewire('../../src/models/job')
Job.__set__('DbConn', testDbConn);
Job.__set__({ console: { log: function () { } } });

describe('Job Model', () => {
  this.job = new Job();

  this.job_id = "";

  describe('src->models->job->createJob', () => {
    it('should success with valid job data', (done) => {
      this.job.createJob(employer1_id, employer1_email, job1).then((doc) => {
        this.job_id = doc._id.toString();
        expect(doc.id.toString()).toBe(employer1_id);
        expect(doc.email).toBe(employer1_email);
        expect(doc.url).toBe("url");
        expect(doc.online).toBe(true);
        expect(doc.salary).toBe("salary");
        expect(doc.offers).toBe("5");
        expect(doc.enable).toBe(false);
        expect(doc.jobTitle).toBe("jobTitle1");
        expect(doc.jobDescription).toBe("jobDescription1");
        done();
      });
    });

    it('should not success with invalid employer id', (done) => {
      this.job.createJob(
        "invalid_id",
        "unreg.employer.email@domain.com",
        job1
      ).catch((error) => {
        expect(error.message).toContain("Cast to ObjectID failed")
        done();
      });
    });

    it('should not success with invalid email', (done) => {
      this.job.createJob(
        "5aa995fe3a6e521cdcb6987b",
        "",
        job1
      ).catch((error) => {
        expect(error.message).toContain("`email` is required.")
        done();
      });
    });

    it('should not success with incomplete job detail', (done) => {
      this.job.createJob(employer1_id, employer1_email, job2).catch((error) => {
        expect(error.message).toContain("`jobDescription` is required.")
        done();
      });
    });
  });


  describe('src->models->job->updateJob', () => {
    it('should success update job with valid data', (done) => {
      this.job.updateJob(this.job_id, job1_updated).then((doc) => {
        expect(doc.id.toString()).toBe(employer1_id);
        expect(doc.email).toBe(employer1_email);
        expect(doc.url).toBe("url Updated");
        expect(doc.online).toBe(false);
        expect(doc.salary).toBe("salary Updated");
        expect(doc.offers).toBe("10");
        expect(doc.enable).toBe(true);
        expect(JSON.stringify(doc.tags)).toBe('["tag1","tag2","tag3"]');
        expect(doc.jobTitle).toBe("jobTitle1 Updated");
        expect(doc.jobDescription).toBe("jobDescription1 Updated");
        done();
      });
    });

    it('should not success update not exist job', (done) => {
      this.job.updateJob(
        "5ad181a15e8aaf224018ffdf",
        job1_updated
      ).catch((error) => {
        expect(error.code).toBe("DB_ERROR_NOT_FOUND");
        done();
      });
    });

    it('should not success update job with invalid id', (done) => {
      this.job.updateJob(
        "invalid_id",
        job1_updated
      ).catch((error) => {
        expect(error.message).toContain("Cast to ObjectId failed");
        done();
      });
    });
  });


  describe('src->models->job->getJobs', () => {
    it('should success get jobs of registered employer id', (done) => {
      this.job.getJobs(employer1_id).then((doc) => {
        let strDoc = JSON.stringify(doc);
        expect(strDoc).toContain('"jobTitle":"jobTitle1 Updated"');
        expect(strDoc).toContain('"jobDescription":"jobDescription1 Updated"');
        expect(strDoc).toContain('"tags":["tag1","tag2","tag3"]');
        expect(strDoc).toContain('"url":"url Updated"');
        expect(strDoc).toContain('"offers":"10"');
        expect(strDoc).toContain('"enable":true');
        expect(strDoc).toContain('"privacy":false');
        expect(strDoc).toContain('"salary":"salary Updated"');
        expect(strDoc).toContain('"id":"' + employer1_id + '"');
        expect(strDoc).toContain('"_id":"' + this.job_id + '"');
        done();
      });
    });

    it('should not success get jobs from unregistered employer id', (done) => {
      this.job.getJobs("5ad181a15e8aaf224018ffdf").then((doc) => {
        expect(doc.length).toEqual(0);
        done();
      });
    });

    it('should not success get jobs from invalid id', (done) => {
      this.job.getJobs("invalid_id").catch((error) => {
        expect(error.message).toContain("Cast to ObjectId failed");
        done();
      });
    });
  });


  describe('src->models->job->getJobsByTags', () => {
    it('should success with exist tags', (done) => {
      this.job.getJobsByTags("tag1|tag2").then((doc) => {
        let strDoc = JSON.stringify(doc);
        expect(strDoc).toContain("tag1");
        expect(strDoc).toContain("tag2");
        done();
      });
    });

    it('should not success with not exist tag names', (done) => {
      this.job.getJobsByTags("tag4").then((doc) => {
        expect(doc.length).toEqual(0);
        done();
      });
    });
  });


  describe('src->models->job->getJobsByTitle', () => {
    it('should success with exist title word', (done) => {
      this.job.getJobsByTitle("jobTitle1").then((doc) => {
        let strDoc = JSON.stringify(doc);
        expect(strDoc).toContain("jobTitle1");
        done();
      });
    });

    it('should not success with not exist title word', (done) => {
      this.job.getJobsByTitle("jobTitle2").then((doc) => {
        expect(doc.length).toEqual(0);
        done();
      });
    });
  });


  describe('src->models->job->getJobsByDescription', () => {
    it('should success with exist description words', (done) => {
      this.job.getJobsByDescription("jobDescription1").then((doc) => {
        let strDoc = JSON.stringify(doc);
        expect(strDoc).toContain("jobDescription1");
        done();
      });
    });

    it('should not success with not exist description words', (done) => {
      this.job.getJobsByDescription("jobDescription2").then((doc) => {
        expect(doc.length).toEqual(0);
        done();
      });
    });
  });


  describe('src->models->job->getJobsByAll', () => {
    it('should success with exist tags & title,description words', (done) => {
      this.job.getJobsByAll("tag1|jobTitle1|jobDescription1").then((doc) => {
        expect(JSON.stringify(doc[0])).toContain("tag1");
        expect(JSON.stringify(doc[1])).toContain("jobTitle1");
        expect(JSON.stringify(doc[2])).toContain("jobDescription1");
        done();
      });
    });

    it('should not success with not exist tags & title,description words', (done) => {
      this.job.getJobsByAll("tag4|jobTitle2|jobDescription2").then((doc) => {
        expect(doc[0].length).toEqual(0);
        expect(doc[1].length).toEqual(0);
        expect(doc[2].length).toEqual(0);
        done();
      });
    });
  });


  describe('src->models->job->getJobsByIds', () => {
    it('should success with exist job id', (done) => {
      this.job.getJobsByIds([this.job_id]).then((doc) => {
        let strDoc = JSON.stringify(doc);
        expect(strDoc).toContain('"jobTitle":"jobTitle1 Updated"');
        expect(strDoc).toContain('"jobDescription":"jobDescription1 Updated"');
        expect(strDoc).toContain('"tags":["tag1","tag2","tag3"]');
        expect(strDoc).toContain('"url":"url Updated"');
        expect(strDoc).toContain('"offers":"10"');
        expect(strDoc).toContain('"salary":"salary Updated"');
        expect(strDoc).toContain('"id":"' + employer1_id + '"');
        expect(strDoc).toContain('"_id":"' + this.job_id + '"');
        done();
      });
    });

    it('should not success with not exist job id', (done) => {
      this.job.getJobsByIds(["5ad181a15e8aaf224018ffdf"]).then((doc) => {
        expect(doc.length).toEqual(0);
        done();
      });
    });
  });


  describe('src->models->job->deleteJob', () => {
    it('should not success with another job owner', (done) => {
      this.job.deleteJob(this.job_id, "5ad181a15e8aaf224018ffdf").then((doc) => {
        expect(doc).toBeNull();
        done();
      });
    });

    it('should success with correct job owner', (done) => {
      this.job.deleteJob(this.job_id, employer1_id).then((doc) => {
        let strDoc = JSON.stringify(doc);
        expect(strDoc).toContain('"jobTitle":"jobTitle1 Updated"');
        expect(strDoc).toContain('"jobDescription":"jobDescription1 Updated"');
        expect(strDoc).toContain('"tags":["tag1","tag2","tag3"]');
        expect(strDoc).toContain('"url":"url Updated"');
        expect(strDoc).toContain('"offers":"10"');
        expect(strDoc).toContain('"enable":true');
        expect(strDoc).toContain('"privacy":false');
        expect(strDoc).toContain('"salary":"salary Updated"');
        expect(strDoc).toContain('"id":"' + employer1_id + '"');
        expect(strDoc).toContain('"_id":"' + this.job_id + '"');
        done();
      });
    });
  });
});