const expect = require('expect');
const rewire = require('rewire');
const testDbConn = require('../testMongooseConn');
const {
  employer1_id,
  employer1_email,
  employer1_ownerInfo,
  employer1_ownerInfoUpdated,
  employer1_companyInfo,
  employer2_id,
  employer2_email,
  employer2_ownerInfo
} = require('../testData');

var Employer = rewire('../../src/models/employer')
Employer.__set__('DbConn', testDbConn);
Employer.__set__({ console: { log: function () { } } });

describe('Employer Model', () => {
  this.employer = new Employer();

  describe('src->models->employer->storeOwnerInfo', () => {
    it('should success with valid employer data', (done) => {
      this.employer.storeOwnerInfo(
        employer1_id,
        employer1_email,
        employer1_ownerInfo
      ).then((doc) => {
        expect(doc._id.toString()).toBe(employer1_id);
        expect(doc.email).toBe(employer1_email);
        expect(doc.firstName).toBe("FirstName");
        expect(doc.lastName).toBe("LastName");
        expect(doc.country).toBe("Country");
        expect(doc.summary).toBe("About Employer");
        done();
      }).catch((error) => {
        expect(error.message).toBe("Already created profile before. Try update profile.");
        done();
      });
    });

    it('should not success with incomplete employer data', (done) => {
      this.employer.storeOwnerInfo(
        employer2_id,
        employer2_email,
        employer2_ownerInfo
      ).catch((error) => {
        expect(error.message).toContain("`country` is required.");
        done();
      });
    });
  });


  describe('src->models->employer->updateOwnerInfo', () => {
    it('should success with valid employer data', (done) => {
      this.employer.updateOwnerInfo(
        employer1_id,
        employer1_ownerInfoUpdated
      ).then((doc) => {
        expect(doc._id.toString()).toBe(employer1_id);
        expect(doc.email).toBe(employer1_email);
        expect(doc.firstName).toBe("FirstName Updated");
        expect(doc.lastName).toBe("LastName Updated");
        expect(doc.country).toBe("Country Updated");
        expect(doc.summary).toBe("About Employer Updated");
        done();
      });
    });

    it('should not success with unregister id', (done) => {
      this.employer.updateOwnerInfo(
        "5aa995fe3a6e521cdcb6987b",
        employer1_ownerInfoUpdated
      ).catch((error) => {
        expect(error.code).toBe("DB_ERROR_NOT_FOUND");
        done();
      });
    });
  });


  describe('src->models->employer->updateCompanyInfo', () => {
    it('should success with valid employer data', (done) => {
      this.employer.updateCompanyInfo(
        employer1_id,
        employer1_companyInfo
      ).then((doc) => {
        expect(doc._id.toString()).toBe(employer1_id);
        expect(doc.email).toBe(employer1_email);
        expect(doc.companyName).toBe("Company Name");
        expect(doc.companyUrl).toBe("Company Url");
        expect(doc.date).toBe("2018-04");
        expect(doc.companyEmail).toBe("company@domain.com");
        expect(doc.aboutCompany).toBe("About Company");
        expect(doc.jobType).toBe("online");
        expect(doc.companySize).toBe("Company Size");
        expect(doc.companyType).toBe("Company Type");
        expect(doc.companyBuilding).toBe("Company Building");
        expect(doc.companyAddress).toBe("Company Address");
        expect(doc.companyCountry).toBe("Company Country");
        done();
      });
    });

    it('should not success with unregister id', (done) => {
      this.employer.updateCompanyInfo(
        "5aa995fe3a6e521cdcb6987b",
        employer1_companyInfo
      ).catch((error) => {
        expect(error.code).toBe("DB_ERROR_NOT_FOUND");
        done();
      });
    });
  });


  describe('src->models->employer->getEmployerById', () => {
    it('should success with register id', (done) => {
      this.employer.getEmployerById(employer1_id).then((doc) => {
        expect(doc._id.toString()).toBe(employer1_id);
        expect(doc.firstName).toBe("FirstName Updated");
        expect(doc.lastName).toBe("LastName Updated");
        expect(doc.country).toBe("Country Updated");
        expect(doc.summary).toBe("About Employer Updated");
        expect(doc.companyName).toBe("Company Name");
        expect(doc.companyUrl).toBe("Company Url");
        expect(doc.date).toBe("2018-04");
        expect(doc.companyEmail).toBe("company@domain.com");
        expect(doc.aboutCompany).toBe("About Company");
        expect(doc.jobType).toBe("online");
        expect(doc.companySize).toBe("Company Size");
        expect(doc.companyType).toBe("Company Type");
        expect(doc.companyBuilding).toBe("Company Building");
        expect(doc.companyAddress).toBe("Company Address");
        expect(doc.companyCountry).toBe("Company Country");
        done();
      });
    });

    it('should not success with unregister id', (done) => {
      this.employer.getEmployerById("5aa995fe3a6e521cdcb6987b").catch((error) => {
        expect(error.code).toBe("EMP_NOT_FOUND");
        done();
      });
    });
  });


  describe('src->models->employer->getOwnerInfoById', () => {
    it('should success with register id', (done) => {
      this.employer.getOwnerInfoById(employer1_id).then((doc) => {
        expect(doc.firstName).toBe("FirstName Updated");
        expect(doc.lastName).toBe("LastName Updated");
        expect(doc.country).toBe("Country Updated");
        expect(doc.summary).toBe("About Employer Updated");
        expect(doc.companyName).toBe(undefined);
        done();
      });
    });

    it('should not success with unregister id', (done) => {
      this.employer.getOwnerInfoById("5aa995fe3a6e521cdcb6987b").catch((error) => {
        expect(error.code).toBe("EMP_NOT_FOUND");
        done();
      });
    });
  });


  describe('src->models->employer->getCompanyInfoById', () => {
    it('should success with register id', (done) => {
      this.employer.getCompanyInfoById(employer1_id).then((doc) => {
        expect(doc.companyName).toBe("Company Name");
        expect(doc.companyUrl).toBe("Company Url");
        expect(doc.date).toBe("2018-04");
        expect(doc.companyEmail).toBe("company@domain.com");
        expect(doc.aboutCompany).toBe("About Company");
        expect(doc.jobType).toBe("online");
        expect(doc.companySize).toBe("Company Size");
        expect(doc.companyType).toBe("Company Type");
        expect(doc.companyBuilding).toBe("Company Building");
        expect(doc.companyAddress).toBe("Company Address");
        expect(doc.companyCountry).toBe("Company Country");
        expect(doc.firstName).toBe(undefined);
        done();
      });
    });

    it('should not success with unregister id', (done) => {
      this.employer.getCompanyInfoById("5aa995fe3a6e521cdcb6987b").catch((error) => {
        expect(error.code).toBe("EMP_NOT_FOUND");
        done();
      });
    });
  });
});