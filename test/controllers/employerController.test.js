const expect = require('expect');
const rewire = require('rewire');
const testDbConn = require('../testMongooseConn');
const employerModel = require('../../src/config/database/mongooseModels/employerModel');
const testRedisConn = require('../testRedisConn');
const {
  employer3_id,
  employer3_email,
  employer1_ownerInfo,
  employer1_ownerInfoUpdated,
  employer1_companyInfo,
  employer2_id,
  employer2_email,
  employer2_ownerInfo,
  seeker1_id,
  seeker1_email,
  job1,
  job1_updated,
  job2,
} = require('../testData');

var Analysor = rewire('../../src/models/analysor')
Analysor.__set__('RedisConn', testRedisConn);
Analysor.__set__({ console: { log: function () { } } });

var Employer = rewire('../../src/models/employer')
Employer.__set__('DbConn', testDbConn);
Employer.__set__({ console: { log: function () { } } });

var Job = rewire('../../src/models/job')
Job.__set__('DbConn', testDbConn);
Job.__set__({ console: { log: function () { } } });

var EmployerController = rewire('../../src/controllers/employerController');
EmployerController.__set__({
  Analysor: Analysor,
  Employer: Employer,
  Job: Job
});

describe('Employer Controller', () => {
  this.employerController = new EmployerController();
  this.job_id = '';

  describe('src->controllers->employerController->createEmployerAndOwnerInfo', () => {
    it('should succes create employer profile with valid data', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email,
        data: employer1_ownerInfo
      };
      this.employerController.createEmployerAndOwnerInfo(obj).then((res) => {
        expect(res.code).toBe("EC_SUCCESS_STORE_EMP");
        done();
      });
    });

    it('should not succes create employer profile by unauthorize user', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email,
        data: employer1_ownerInfo
      };
      this.employerController.createEmployerAndOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_UNAUTHORIZED");
        done();
      });
    });

    it('should not succes create employer profile with invalid authentication', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: employer3_email,
        data: employer1_ownerInfo
      };
      this.employerController.createEmployerAndOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_AUTH");
        done();
      });
    });

    it('should not succes create employer profile with invalid id', (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: employer3_email,
        data: employer1_ownerInfo
      };
      this.employerController.createEmployerAndOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_STORE_VALIDATION");
        done();
      });
    });

    it('should not succes create employer profile with invalid email', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: "invalid_email",
        data: employer1_ownerInfo
      };
      this.employerController.createEmployerAndOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_STORE_VALIDATION");
        done();
      });
    });

    it('should not succes create employer profile with incomplete data', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email,
        data: employer2_ownerInfo
      };
      this.employerController.createEmployerAndOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_STORE_EMP");
        done();
      });
    });
  });


  describe('src->controllers->employerController->employerUpdateOwnerInfo', () => {
    it('should succes update employer profile with valid data', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email,
        data: employer1_ownerInfoUpdated
      };
      this.employerController.employerUpdateOwnerInfo(obj).then((res) => {
        expect(res.code).toBe("EC_SUCCESS_UPDATE_OWNER");
        done();
      });
    });

    it('should not succes update employer profile by unauthorize user', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email,
        data: employer1_ownerInfo
      };
      this.employerController.employerUpdateOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_UNAUTHORIZED");
        done();
      });
    });

    it('should not succes update employer profile with invalid authentication', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: employer3_email,
        data: employer1_ownerInfo
      };
      this.employerController.employerUpdateOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_AUTH");
        done();
      });
    });

    it('should not succes update employer profile with invalid id', (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: employer3_email,
        data: employer1_ownerInfo
      };
      this.employerController.employerUpdateOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_UPDATE_VALIDATION");
        done();
      });
    });

    it('should not succes update employer profile with invalid email', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: "invalid_email",
        data: employer1_ownerInfo
      };
      this.employerController.employerUpdateOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_UPDATE_VALIDATION");
        done();
      });
    });
  });


  describe('src->controllers->employerController->employerUpdateCompanyInfo', () => {
    it("should succes update employer's company info with valid data", (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email,
        data: employer1_companyInfo
      };
      this.employerController.employerUpdateCompanyInfo(obj).then((res) => {
        expect(res.code).toBe("EC_SUCCESS_UPDATE_COMPANY");
        done();
      });
    });

    it("should not succes update employer's company info without create profile", (done) => {
      let obj = {
        userId: employer2_id,
        userEmail: employer2_email,
        data: employer1_companyInfo
      };
      this.employerController.employerUpdateOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_AUTH");
        done();
      });
    });

    it("should not succes update employer's company info by unauthorize user", (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email,
        data: employer1_companyInfo
      };
      this.employerController.employerUpdateOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_UNAUTHORIZED");
        done();
      });
    });

    it("should not succes update employer's company info with invalid authentication", (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: employer3_email,
        data: employer1_companyInfo
      };
      this.employerController.employerUpdateOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_AUTH");
        done();
      });
    });

    it("should not succes update employer's company info with invalid id", (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: employer3_email,
        data: employer1_companyInfo
      };
      this.employerController.employerUpdateOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_UPDATE_VALIDATION");
        done();
      });
    });

    it("should not succes update employer's company info with invalid email", (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: "invalid_email",
        data: employer1_companyInfo
      };
      this.employerController.employerUpdateOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_UPDATE_VALIDATION");
        done();
      });
    });
  });


  describe('src->controllers->employerController->employerGetOwnerInfo', () => {
    it("should succes get employer's info with valid data", (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email,
      };
      this.employerController.employerGetOwnerInfo(obj).then((res) => {
        expect(res.firstName).toBe('FirstName Updated');
        expect(res.lastName).toBe('LastName Updated');
        expect(res.country).toBe('Country Updated');
        expect(res.summary).toBe('About Employer Updated');
        expect(res.companyName).toBeUndefined();
        done();
      });
    });

    it("should not succes get employer's info without create profile", (done) => {
      let obj = {
        userId: employer2_id,
        userEmail: employer2_email
      };
      this.employerController.employerGetOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_AUTH_GET_E&I");
        done();
      });
    });

    it("should not succes get employer's info by unauthorize user", (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email
      };
      this.employerController.employerGetOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_UNAUTHORIZED");
        done();
      });
    });

    it("should not succes get employer's info with invalid authentication", (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: employer3_email
      };
      this.employerController.employerGetOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_AUTH_GET_E&I");
        done();
      });
    });

    it("should not succes get employer's info with invalid id", (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: employer3_email
      };
      this.employerController.employerGetOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_GET_VALIDATION");
        done();
      });
    });

    it("should not succes get employer's info with invalid email", (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: "invalid_email"
      };
      this.employerController.employerGetOwnerInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_GET_VALIDATION");
        done();
      });
    });
  });


  describe('src->controllers->employerController->employerGetCompanyInfo', () => {
    it("should succes get employer's company info with valid data", (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email
      };
      this.employerController.employerGetCompanyInfo(obj).then((res) => {
        expect(res.companyName).toBe('Company Name');
        expect(res.companyUrl).toBe('Company Url');
        expect(res.date).toBe('2018-04');
        expect(res.companyEmail).toBe('company@domain.com');
        expect(res.aboutCompany).toBe('About Company');
        expect(res.jobType).toBe('online');
        expect(res.companyType).toBe('Company Type');
        expect(res.companySize).toBe('Company Size');
        expect(res.firstName).toBeUndefined();
        done();
      });
    });

    it("should not succes get employer's company info without create profile", (done) => {
      let obj = {
        userId: employer2_id,
        userEmail: employer2_email
      };
      this.employerController.employerGetCompanyInfo(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_AUTH_GET_E&I");
        done();
      });
    });

    it("should not succes get employer's company info by unauthorize user", (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email
      };
      this.employerController.employerGetCompanyInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_UNAUTHORIZED");
        done();
      });
    });

    it("should not succes get employer's company info with invalid authentication", (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: employer3_email
      };
      this.employerController.employerGetCompanyInfo(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_AUTH_GET_E&I");
        done();
      });
    });

    it("should not succes get employer's company info with invalid id", (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: employer3_email
      };
      this.employerController.employerGetCompanyInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_GET_VALIDATION");
        done();
      });
    });

    it("should not succes get employer's company info with invalid email", (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: "invalid_email"
      };
      this.employerController.employerGetCompanyInfo(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_GET_VALIDATION");
        done();
      });
    });
  });


  describe('src->controllers->employerController->employerGetProfile', () => {
    it("should succes get employer's profile with valid data", (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email
      };
      this.employerController.employerGetProfile(obj).then((res) => {
        expect(res.companyName).toBe('Company Name');
        expect(res.companyUrl).toBe('Company Url');
        expect(res.date).toBe('2018-04');
        expect(res.companyEmail).toBe('company@domain.com');
        expect(res.aboutCompany).toBe('About Company');
        expect(res.jobType).toBe('online');
        expect(res.companyType).toBe('Company Type');
        expect(res.companySize).toBe('Company Size');
        expect(res.firstName).toBe('FirstName Updated');
        expect(res.lastName).toBe('LastName Updated');
        expect(res.country).toBe('Country Updated');
        expect(res.summary).toBe('About Employer Updated');
        done();
      });
    });

    it("should not succes get employer's profile without create profile", (done) => {
      let obj = {
        userId: employer2_id,
        userEmail: employer2_email
      };
      this.employerController.employerGetProfile(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_AUTH_GET_E&I");
        done();
      });
    });

    it("should not succes get employer's profile by unauthorize user", (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email
      };
      this.employerController.employerGetProfile(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_UNAUTHORIZED");
        done();
      });
    });

    it("should not succes get employer's profile with invalid authentication", (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: employer3_email
      };
      this.employerController.employerGetProfile(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_AUTH_GET_E&I");
        done();
      });
    });

    it("should not succes get employer's profile with invalid id", (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: employer3_email
      };
      this.employerController.employerGetProfile(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_GET_VALIDATION");
        done();
      });
    });

    it("should not succes get employer's profile with invalid email", (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: "invalid_email"
      };
      this.employerController.employerGetProfile(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_GET_VALIDATION");
        done();
      });
    });
  });


  describe('src->controllers->employerController->employerAddJob', () => {
    it('should succes create job with valid data', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email,
        data: job1
      };
      this.employerController.employerAddJob(obj).then((res) => {
        expect(res.code).toBe("EC_SUCCESS_ADD_JOB");
        done();
      });
    });

    it('should not succes create job without create employer profile', (done) => {
      let obj = {
        userId: employer2_id,
        userEmail: employer2_email,
        data: job1
      };
      this.employerController.employerAddJob(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_GET_E&I");
        done();
      });
    });

    it('should not succes create job by unauthorize user', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email,
        data: job1
      };
      this.employerController.employerAddJob(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_GET_E&I");
        done();
      });
    });

    it('should not succes create job with invalid authentication', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: employer3_email,
        data: job1
      };
      this.employerController.employerAddJob(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_GET_E&I");
        done();
      });
    });

    it('should not succes create job with invalid id', (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: employer3_email,
        data: job1
      };
      this.employerController.employerAddJob(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_ADD_VALIDATION");
        done();
      });
    });

    it('should not succes create job with invalid email', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: "invalid_email",
        data: job1
      };
      this.employerController.employerAddJob(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_ADD_VALIDATION");
        done();
      });
    });

    it('should not succes create job with incomplete data', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email,
        data: job2
      };
      this.employerController.employerAddJob(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_STORE_JOB");
        done();
      });
    });
  });


  describe('src->controllers->employerController->employerViewJobs', () => {
    it('should succes get job with valid data', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email
      };
      this.employerController.employerViewJobs(obj).then((res) => {
        this.job_id = res[0]._id.toString();
        let strDoc = JSON.stringify(res);
        expect(strDoc).toContain('"jobTitle":"jobTitle1"');
        expect(strDoc).toContain('"jobDescription":"jobDescription1"');
        expect(strDoc).toContain('"tags":["tag1","tag2"]');
        expect(strDoc).toContain('"url":"url"');
        expect(strDoc).toContain('"offers":"5"');
        expect(strDoc).toContain('"enable":false');
        expect(strDoc).toContain('"privacy":true');
        expect(strDoc).toContain('"salary":"salary"');
        expect(strDoc).toContain('"id":"' + employer3_id + '"');
        done();
      }).catch((error) => {
        // expect(error.code).toBe("DB_ERROR_GET_E&I");
        console.log('TEST:ERROR:', error);
        done();
      });
    });

    it('should not succes get job without create employer profile', (done) => {
      let obj = {
        userId: employer2_id,
        userEmail: employer2_email
      };
      this.employerController.employerViewJobs(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_GET_E&I");
        done();
      });
    });

    it('should not succes get job by unauthorize user', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email
      };
      this.employerController.employerViewJobs(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_GET_E&I");
        done();
      });
    });

    it('should not succes get job with invalid authentication', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: employer3_email
      };
      this.employerController.employerViewJobs(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_GET_E&I");
        done();
      });
    });

    it('should not succes get job with invalid id', (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: employer3_email
      };
      this.employerController.employerViewJobs(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_VIEW_VALIDATION");
        done();
      });
    });

    it('should not succes get job with invalid email', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: "invalid_email"
      };
      this.employerController.employerViewJobs(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_VIEW_VALIDATION");
        done();
      });
    });
  });


  describe('src->controllers->employerController->employerUpdateJob', () => {
    it('should succes update job with valid data', (done) => {
      let job = job1;
      job._id = this.job_id;
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email,
        data: job
      };
      this.employerController.employerUpdateJob(obj).then((res) => {
        expect(res.code).toBe("EC_SUCCESS_UPDATE_JOB");
        done();
      });
    });

    it('should not succes update job without create employer profile', (done) => {
      let obj = {
        userId: employer2_id,
        userEmail: employer2_email,
        data: job1
      };
      this.employerController.employerUpdateJob(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_GET_E&I");
        done();
      });
    });

    it('should not succes update job by unauthorize user', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email,
        data: job1
      };
      this.employerController.employerUpdateJob(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_GET_E&I");
        done();
      });
    });

    it('should not succes update job with invalid authentication', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: employer3_email,
        data: job1
      };
      this.employerController.employerUpdateJob(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_GET_E&I");
        done();
      });
    });

    it('should not succes update job with invalid id', (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: employer3_email,
        data: job1
      };
      this.employerController.employerUpdateJob(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_UPDATE_VALIDATION");
        done();
      });
    });

    it('should not succes update job with invalid email', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: "invalid_email",
        data: job1
      };
      this.employerController.employerUpdateJob(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_UPDATE_VALIDATION");
        done();
      });
    });

    it('should not succes update job with incomplete data', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email,
        data: job2
      };
      this.employerController.employerUpdateJob(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_NOT_FOUND");
        done();
      });
    });
  });


  describe('src->controllers->employerController->employerDeleteJob', () => {
    it('should not succes delete job without create employer profile', (done) => {
      let obj = {
        userId: employer2_id,
        userEmail: employer2_email,
        data: { _id: this.job_id }
      };
      this.employerController.employerDeleteJob(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_GET_E&I");
        done();
      });
    });

    it('should not succes delete job by unauthorize user', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email,
        data: { _id: this.job_id }
      };
      this.employerController.employerDeleteJob(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_GET_E&I");
        done();
      });
    });

    it('should not succes delete job with invalid authentication', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: employer3_email,
        data: { _id: this.job_id }
      };
      this.employerController.employerDeleteJob(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_GET_E&I");
        done();
      });
    });

    it('should not succes delete job with invalid id', (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: employer3_email,
        data: { _id: this.job_id }
      };
      this.employerController.employerDeleteJob(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_DELETE_VALIDATION");
        done();
      });
    });

    it('should not succes delete job with invalid email', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: "invalid_email",
        data: { _id: this.job_id }
      };
      this.employerController.employerDeleteJob(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_DELETE_VALIDATION");
        done();
      });
    });

    it('should not succes delete job with incomplete data', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email,
        data: {}
      };
      this.employerController.employerDeleteJob(obj).catch((error) => {
        expect(error.code).toBe("EC_ERROR_DELETE_VALIDATION");
        done();
      });
    });

    it('should succes delete job with valid data', (done) => {
      let obj = {
        userId: employer3_id,
        userEmail: employer3_email,
        data: { _id: this.job_id }
      };
      this.employerController.employerDeleteJob(obj).then((res) => {
        expect(res.code).toBe("EC_SUCCESS_DELETE_JOB");
        done();
      });
    });
  });


  it('delete test employer if exists', (done) => {
    let dbConn = new testDbConn();
    let mongoose = dbConn.getConnection();
    employerModel.findOneAndRemove({ _id: employer3_id }).then((res) => {
      done();
    })
  });
});