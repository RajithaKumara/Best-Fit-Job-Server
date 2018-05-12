const expect = require('expect');
const rewire = require('rewire');
const testDbConn = require('../testMongooseConn');
const seekerModel = require('../../src/config/database/mongooseModels/seekerModel');
const testRedisConn = require('../testRedisConn');
const {
  employer1_id,
  employer1_email,
  seeker1_id,
  seeker1_email,
  seeker3_id,
  seeker3_email,
  seeker3_data,
  seeker3_data_updated,
  seeker2_id,
  seeker2_email
} = require('../testData');

var Analysor = rewire('../../src/models/analysor')
Analysor.__set__('RedisConn', testRedisConn);
Analysor.__set__({ console: { log: function () { } } });

var Seeker = rewire('../../src/models/seeker')
Seeker.__set__('DbConn', testDbConn);
Seeker.__set__({ console: { log: function () { } } });

var Job = rewire('../../src/models/job')
Job.__set__('DbConn', testDbConn);
Job.__set__({ console: { log: function () { } } });

var SeekerController = rewire('../../src/controllers/seekerController');
SeekerController.__set__({
  Analysor: Analysor,
  Seeker: Seeker,
  Job: Job
});

describe('Seeker Controller', () => {
  this.seekerController = new SeekerController();

  describe('src->controllers->seekerController->createSeekerAndGeneralInfo', () => {
    it('should not succes create seeker profile by unauthorize user', (done) => {
      let obj = {
        userId: employer1_id,
        userEmail: employer1_email,
        data: seeker3_data,
        action: 'general'
      };
      this.seekerController.createSeekerAndGeneralInfo(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_UNAUTHORIZED");
        done();
      });
    });

    it('should not succes create seeker profile with invalid authentication', (done) => {
      let obj = {
        userId: employer1_id,
        userEmail: seeker3_email,
        data: seeker3_data,
        action: 'general'
      };
      this.seekerController.createSeekerAndGeneralInfo(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_AUTH");
        done();
      });
    });

    it('should not succes create seeker profile with invalid id', (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: seeker3_email,
        data: seeker3_data,
        action: 'general'
      };
      this.seekerController.createSeekerAndGeneralInfo(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_IDENTITY");
        done();
      });
    });

    it('should not succes create seeker profile with invalid email', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: "invalid_email",
        data: seeker3_data,
        action: 'general'
      };
      this.seekerController.createSeekerAndGeneralInfo(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_IDENTITY");
        done();
      });
    });

    it('should not succes create seeker profile with invalid action', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: seeker3_data,
        action: 'invalid_action'
      };
      this.seekerController.createSeekerAndGeneralInfo(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_ACTION_INVALID");
        done();
      });
    });

    it('should not succes create seeker profile with incomplete data', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: null,
        action: 'general'
      };
      this.seekerController.createSeekerAndGeneralInfo(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_STORE_GENERAL");
        done();
      });
    });

    it('should success create seeker profile with valid general info', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: seeker3_data,
        action: 'general'
      };
      this.seekerController.createSeekerAndGeneralInfo(obj).then((res) => {
        expect(res.code).toBe('SC_SUCCESS_STORE_GENERAL');
        done();
      }).catch((error) => {
        expect(error.message).toBe("Already created profile before. Try update profile.");
        done();
      });
    });
  });


  describe('src->controllers->seekerController->seekerUpdateField', () => {
    it('should not succes update seeker profile without create seeker profile', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email,
        data: seeker3_data_updated,
        action: 'general'
      };
      this.seekerController.seekerUpdateField(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_UPDATE_FIELD");
        done();
      });
    });

    it('should not succes update seeker profile by unauthorize user', (done) => {
      let obj = {
        userId: employer1_id,
        userEmail: employer1_email,
        data: seeker3_data_updated,
        action: 'general'
      };
      this.seekerController.seekerUpdateField(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_UNAUTHORIZED");
        done();
      });
    });

    it('should not succes update seeker profile with invalid authentication', (done) => {
      let obj = {
        userId: employer1_id,
        userEmail: seeker3_email,
        data: seeker3_data_updated,
        action: 'general'
      };
      this.seekerController.seekerUpdateField(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_AUTH");
        done();
      });
    });

    it('should not succes update seeker profile with invalid id', (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: seeker3_email,
        data: seeker3_data_updated,
        action: 'general'
      };
      this.seekerController.seekerUpdateField(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_IDENTITY");
        done();
      });
    });

    it('should not succes update seeker profile with invalid email', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: "invalid_email",
        data: seeker3_data_updated,
        action: 'general'
      };
      this.seekerController.seekerUpdateField(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_IDENTITY");
        done();
      });
    });

    it('should not succes update seeker profile with invalid action', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: seeker3_data_updated,
        action: 'invalid_action'
      };
      this.seekerController.seekerUpdateField(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_ACTION_INVALID");
        done();
      });
    });

    it('should not succes update seeker profile with incomplete data', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: null,
        action: 'ksao'
      };
      this.seekerController.seekerUpdateField(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_DATA_INVALID");
        done();
      });
    });

    it('should success update seeker profile with valid general info', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: seeker3_data_updated,
        action: 'general'
      };
      this.seekerController.seekerUpdateField(obj).then((res) => {
        expect(res.code).toBe('SC_SUCCESS_UPDATE_FIELD');
        expect(res.message).toBe('Successfully updated general information.');
        done();
      });
    });

    it('should success update contact field of seeker profile', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: [
          { type: 'google', detail: "email@gmail.com" },
          { type: 'mobile', detail: "1122334455" }
        ],
        action: 'contacts'
      };
      this.seekerController.seekerUpdateField(obj).then((res) => {
        expect(res.code).toBe('SC_SUCCESS_UPDATE_FIELD');
        expect(res.message).toBe('Successfully updated contacts information.');
        done();
      });
    });

    it('should success update experience field of seeker profile', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: [{
          title: "seeker3 experience title",
          company: "seeker3 experience company",
          description: "seeker3 experience description"
        }],
        action: 'experience'
      };
      this.seekerController.seekerUpdateField(obj).then((res) => {
        expect(res.code).toBe('SC_SUCCESS_UPDATE_FIELD');
        expect(res.message).toBe('Successfully updated experience information.');
        done();
      });
    });

    it('should success update education field of seeker profile', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: [{
          school: "seeker3 education school",
          field: "seeker3 education field",
          description: "seeker3 education description"
        }],
        action: 'education'
      };
      this.seekerController.seekerUpdateField(obj).then((res) => {
        expect(res.code).toBe('SC_SUCCESS_UPDATE_FIELD');
        expect(res.message).toBe('Successfully updated education information.');
        done();
      });
    });

    it('should success update ksao field of seeker profile', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: [{
          name: "seeker3 ksao name",
          description: "seeker3 ksao description"
        }],
        action: 'ksao'
      };
      this.seekerController.seekerUpdateField(obj).then((res) => {
        expect(res.code).toBe('SC_SUCCESS_UPDATE_FIELD');
        expect(res.message).toBe('Successfully updated ksao information.');
        done();
      });
    });

    it('should success update extra field of seeker profile', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: [{
          name: "seeker3 extra name",
          description: "seeker3 extra description"
        }],
        action: 'extra'
      };
      this.seekerController.seekerUpdateField(obj).then((res) => {
        expect(res.code).toBe('SC_SUCCESS_UPDATE_FIELD');
        expect(res.message).toBe('Successfully updated extra information.');
        done();
      });
    });

    it('should success update tags field of seeker profile', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: ["tag1", "tag2"],
        action: 'tags'
      };
      this.seekerController.seekerUpdateField(obj).then((res) => {
        expect(res.code).toBe('SC_SUCCESS_UPDATE_FIELD');
        expect(res.message).toBe('Successfully updated tags information.');
        done();
      });
    });
  });


  describe('src->controllers->seekerController->seekerGetProfile', () => {
    it('should not succes get seeker profile by unauthorize user', (done) => {
      let obj = {
        userId: employer1_id,
        userEmail: employer1_email
      };
      this.seekerController.seekerGetProfile(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_UNAUTHORIZED");
        done();
      });
    });

    it('should not succes get seeker profile with invalid authentication', (done) => {
      let obj = {
        userId: employer1_id,
        userEmail: seeker3_email
      };
      this.seekerController.seekerGetProfile(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_AUTH_GET_E&I");
        done();
      });
    });

    it('should not succes get seeker profile with invalid id', (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: seeker3_email
      };
      this.seekerController.seekerGetProfile(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_GETP_VALIDATION");
        done();
      });
    });

    it('should not succes get seeker profile with invalid email', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: "invalid_email"
      };
      this.seekerController.seekerGetProfile(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_GETP_VALIDATION");
        done();
      });
    });

    it('should success get seeker profile with valid data', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email
      };
      this.seekerController.seekerGetProfile(obj).then((res) => {
        expect(res.general.firstName).toBe('seeker3 firstName updated');
        expect(res.general.lastName).toBe('seeker3 lastName updated');
        expect(res.general.dob).toBe('seeker3 dob updated');
        expect(res.general.gender).toBe('seeker3 gender updated');
        expect(res.general.country).toBe('seeker3 country updated');
        expect(JSON.stringify(res.contacts)).toContain('"type":"google"');
        expect(JSON.stringify(res.contacts)).toContain('"detail":"email@gmail.com"');
        expect(JSON.stringify(res.contacts)).toContain('"type":"mobile"');
        expect(JSON.stringify(res.contacts)).toContain('"detail":"1122334455"');
        expect(JSON.stringify(res.experience)).toContain('"title":"seeker3 experience title"');
        expect(JSON.stringify(res.experience)).toContain('"company":"seeker3 experience company"');
        expect(JSON.stringify(res.experience)).toContain('"description":"seeker3 experience description"');
        expect(JSON.stringify(res.education)).toContain('"school":"seeker3 education school"');
        expect(JSON.stringify(res.education)).toContain('"field":"seeker3 education field"');
        expect(JSON.stringify(res.education)).toContain('"description":"seeker3 education description"');
        expect(JSON.stringify(res.ksao)).toContain('"name":"seeker3 ksao name"');
        expect(JSON.stringify(res.ksao)).toContain('"description":"seeker3 ksao description"');
        expect(JSON.stringify(res.extra)).toContain('"name":"seeker3 extra name"');
        expect(JSON.stringify(res.extra)).toContain('"description":"seeker3 extra description"');
        expect(JSON.stringify(res.tags)).toContain('["tag1","tag2"]');
        done();
      });
    });
  });


  describe('src->controllers->seekerController->seekerAddSkills', () => {
    it('should not succes add skills to seeker profile without create seeker profile', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email,
        data: [{ name: "name1 new", description: "description1 new" }],
        action: 'ksao'
      };
      this.seekerController.seekerAddSkills(obj).catch((error) => {
        expect(error.code).toBe("SEEKER_NOT_FOUND");
        done();
      });
    });

    it('should not succes add skills to seeker profile by unauthorize user', (done) => {
      let obj = {
        userId: employer1_id,
        userEmail: employer1_email,
        data: [{ name: "name1 new", description: "description1 new" }],
        action: 'ksao'
      };
      this.seekerController.seekerAddSkills(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_UNAUTHORIZED");
        done();
      });
    });

    it('should not succes add skills to seeker profile with invalid authentication', (done) => {
      let obj = {
        userId: employer1_id,
        userEmail: seeker3_email,
        data: [{ name: "name1 new", description: "description1 new" }],
        action: 'ksao'
      };
      this.seekerController.seekerAddSkills(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_AUTH_GET_E&I");
        done();
      });
    });

    it('should not succes add skills to seeker profile with invalid id', (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: seeker3_email,
        data: [{ name: "name1 new", description: "description1 new" }],
        action: 'ksao'
      };
      this.seekerController.seekerAddSkills(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_IDENTITY");
        done();
      });
    });

    it('should not succes add skills to seeker profile with invalid email', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: "invalid_email",
        data: [{ name: "name1 new", description: "description1 new" }],
        action: 'ksao'
      };
      this.seekerController.seekerAddSkills(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_IDENTITY");
        done();
      });
    });

    it('should not succes add skills to seeker profile with invalid action', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: [{ name: "name1 new", description: "description1 new" }],
        action: 'invalid_action'
      };
      this.seekerController.seekerAddSkills(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_ACTION_INVALID");
        done();
      });
    });

    it('should not succes add skills to seeker profile with incomplete data', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: null,
        action: 'ksao'
      };
      this.seekerController.seekerAddSkills(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_DATA_INVALID");
        done();
      });
    });

    it('should success add skills to seeker profile with valid general info', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: [{ name: "name1 new", description: "description1 new" }],
        action: 'ksao'
      };
      this.seekerController.seekerAddSkills(obj).then((res) => {
        expect(res.code).toBe('SC_SUCCESS_ADD_SKILLS');
        done();
      });
    });
  });


  describe('src->controllers->seekerController->seekerAddTags', () => {
    it('should not succes add tags to seeker profile without create seeker profile', (done) => {
      let obj = {
        userId: seeker1_id,
        userEmail: seeker1_email,
        data: ["tag1 new", "tag2 new"],
        action: 'tags'
      };
      this.seekerController.seekerAddTags(obj).catch((error) => {
        expect(error.code).toBe("SEEKER_NOT_FOUND");
        done();
      });
    });

    it('should not succes add tags to seeker profile by unauthorize user', (done) => {
      let obj = {
        userId: employer1_id,
        userEmail: employer1_email,
        data: ["tag1 new", "tag2 new"],
        action: 'tags'
      };
      this.seekerController.seekerAddTags(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_UNAUTHORIZED");
        done();
      });
    });

    it('should not succes add tags to seeker profile with invalid authentication', (done) => {
      let obj = {
        userId: employer1_id,
        userEmail: seeker3_email,
        data: ["tag1 new", "tag2 new"],
        action: 'tags'
      };
      this.seekerController.seekerAddTags(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_AUTH_GET_E&I");
        done();
      });
    });

    it('should not succes add tags to seeker profile with invalid id', (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: seeker3_email,
        data: ["tag1 new", "tag2 new"],
        action: 'tags'
      };
      this.seekerController.seekerAddTags(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_IDENTITY");
        done();
      });
    });

    it('should not succes add tags to seeker profile with invalid email', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: "invalid_email",
        data: ["tag1 new", "tag2 new"],
        action: 'tags'
      };
      this.seekerController.seekerAddTags(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_IDENTITY");
        done();
      });
    });

    it('should not succes add tags to seeker profile with invalid action', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: ["tag1 new", "tag2 new"],
        action: 'invalid_action'
      };
      this.seekerController.seekerAddTags(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_ACTION_INVALID");
        done();
      });
    });

    it('should not succes add tags to seeker profile with incomplete data', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: null,
        action: 'tags'
      };
      this.seekerController.seekerAddTags(obj).catch((error) => {
        expect(error.code).toBe("SC_VALIDATION_DATA_INVALID");
        done();
      });
    });

    it('should success add tags to seeker profile with valid general info', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: ["tag1 new", "tag2 new"],
        action: 'tags'
      };
      this.seekerController.seekerAddTags(obj).then((res) => {
        expect(res.code).toBe('SC_SUCCESS_ADD_TAGS');
        done();
      });
    });
  });


  describe('src->controllers->seekerController->seekerSearchJobs', () => {
    it('should succes with valid data', (done) => {
      this.seekerController.seekerSearchJobs({
        userId: seeker3_id,
        userEmail: seeker3_email,
        data: "tag1"
      }).then((res) => {
        expect(Array.isArray(res)).toBe(true);
        done();
      });
    });

    it('should not succes with invalid id', (done) => {
      let obj = {
        userId: "invalid_id",
        userEmail: seeker3_email,
        data: "tag1"
      };
      this.seekerController.seekerSearchJobs(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_SEARCH_VALIDATION");
        done();
      });
    });

    it('should not succes with invalid email', (done) => {
      let obj = {
        userId: seeker3_id,
        userEmail: "invalid_email",
        data: "tag1"
      };
      this.seekerController.seekerSearchJobs(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_SEARCH_VALIDATION");
        done();
      });
    });

    it('should not succes search by unauthorize user', (done) => {
      let obj = {
        userId: employer1_id,
        userEmail: employer1_email,
        data: "tag1"
      };
      this.seekerController.seekerSearchJobs(obj).catch((error) => {
        expect(error.code).toBe("SC_ERROR_UNAUTHORIZED");
        done();
      });
    });

    it('should not succes search with invalid authentication', (done) => {
      let obj = {
        userId: employer1_id,
        userEmail: seeker3_email,
        data: "tag1"
      };
      this.seekerController.seekerSearchJobs(obj).catch((error) => {
        expect(error.code).toBe("DB_ERROR_AUTH_GET_E&I");
        done();
      });
    });
  });


  it('delete test seeker if exists', (done) => {
    let dbConn = new testDbConn();
    let mongoose = dbConn.getConnection();
    seekerModel.remove({ '_id': { $in: [seeker1_id, seeker3_id] } }).then((res) => {
      done();
    });
  });
});