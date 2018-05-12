const expect = require('expect');
const rewire = require('rewire');
const testDbConn = require('../testMongooseConn');
const {
  seeker1_id,
  seeker1_email,
  seeker2_id,
  seeker2_email
} = require('../testData');

var Seeker = rewire('../../src/models/seeker')
Seeker.__set__('DbConn', testDbConn);
Seeker.__set__({ console: { log: function () { } } });

describe('Seeker Model', () => {
  this.seeker = new Seeker();

  describe('src->models->seeker->getAuthUserByIdAndEmail', () => {
    it('should success get seeker by registered id & email', (done) => {
      this.seeker.getAuthUserByIdAndEmail(seeker1_id, seeker1_email).then((doc) => {
        expect(doc.id.toString()).toBe(seeker1_id);
        expect(doc.email).toBe(seeker1_email);
        expect(doc.role).toBe("seeker");
        done();
      });
    });

    it('should not success get seeker by unregistered id & email', (done) => {
      this.seeker.getAuthUserByIdAndEmail(
        "5aa995fe3a6e521cdcb6987b",
        "unreg.seeker.email@domain.com"
      ).catch((error) => {
        expect(error.code).toBe("DB_ERROR_AUTH_GET_E&I");
        done();
      });
    });
  });


  describe('src->models->seeker->storeGenaralInfo', () => {
    it('should success create seeker & store general info with valid data', (done) => {
      this.seeker.storeGenaralInfo(
        seeker1_id,
        seeker1_email,
        {
          firstName: "seeker1 firstName",
          lastName: "seeker1 lastName",
          dob: "seeker1 dob",
          gender: "seeker1 gender",
          country: "seeker1 country",
          currentPosition: "seeker1 currentPosition",
          summary: "seeker1 summary"
        }
      ).then((doc) => {
        expect(doc._id.toString()).toBe(seeker1_id);
        expect(doc.email).toBe(seeker1_email);
        expect(JSON.stringify(doc.general)).toContain('seeker1 firstName');
        expect(JSON.stringify(doc.general)).toContain('seeker1 lastName');
        expect(JSON.stringify(doc.general)).toContain('seeker1 dob');
        expect(JSON.stringify(doc.general)).toContain('seeker1 gender');
        expect(JSON.stringify(doc.general)).toContain('seeker1 country');
        expect(JSON.stringify(doc.general)).toContain('seeker1 currentPosition');
        expect(JSON.stringify(doc.general)).toContain('seeker1 summary');
        done();
      }).catch((error) => {
        expect(error.message).toBe("Already created profile before. Try update profile.");
        done();
      });
    });

    it('should not success create seeker without id', (done) => {
      this.seeker.storeGenaralInfo(
        "",
        seeker2_email,
        {
          firstName: "seeker2 firstName",
          lastName: "seeker2 lastName",
          dob: "seeker2 dob",
          gender: "seeker2 gender",
          country: "seeker2 country",
          currentPosition: "seeker2 currentPosition",
          summary: "seeker2 summary"
        }
      ).catch((error) => {
        expect(error.message).toContain("seeker validation failed");
        done();
      });
    });

    it('should not success create seeker without email', (done) => {
      this.seeker.storeGenaralInfo(
        seeker2_id,
        "",
        {
          firstName: "seeker2 firstName",
          lastName: "seeker2 lastName",
          dob: "seeker2 dob",
          gender: "seeker2 gender",
          country: "seeker2 country",
          currentPosition: "seeker2 currentPosition",
          summary: "seeker2 summary"
        }
      ).catch((error) => {
        expect(error.message).toContain("`email` is required.");
        done();
      });
    });

    it('should not success create seeker without general info', (done) => {
      this.seeker.storeGenaralInfo(
        seeker2_id,
        seeker2_email,
        null
      ).catch((error) => {
        expect(error.message).toContain("`general` is required.");
        done();
      });
    });
  });


  describe('src->models->seeker->getSeekerByIdAndEmail', () => {
    it('should success profile get seeker by registered id & email', (done) => {
      this.seeker.getSeekerByIdAndEmail(seeker1_id, seeker1_email).then((doc) => {
        expect(doc._id.toString()).toBe(seeker1_id);
        expect(JSON.stringify(doc.general)).toContain('seeker1 firstName');
        expect(JSON.stringify(doc.general)).toContain('seeker1 lastName');
        expect(JSON.stringify(doc.general)).toContain('seeker1 dob');
        expect(JSON.stringify(doc.general)).toContain('seeker1 gender');
        expect(JSON.stringify(doc.general)).toContain('seeker1 country');
        expect(JSON.stringify(doc.general)).toContain('seeker1 currentPosition');
        expect(JSON.stringify(doc.general)).toContain('seeker1 summary');
        done();
      });
    });

    it('should not success profile get seeker by unregistered id & email', (done) => {
      this.seeker.getSeekerByIdAndEmail(
        "5aa995fe3a6e521cdcb6987b",
        "unreg.seeker.email@domain.com"
      ).catch((error) => {
        expect(error.code).toBe('SEEKER_NOT_FOUND');
        done();
      });
    });

    it('should not success profile get seeker by invalid id & email', (done) => {
      this.seeker.getSeekerByIdAndEmail(
        "",
        ""
      ).catch((error) => {
        expect(error.code).toBe('DB_ERROR_GET_PROFILE');
        done();
      });
    });
  });


  describe('src->models->seeker->updateField', () => {
    it('should success update contact field of seeker1 profile', (done) => {
      this.seeker.updateField(seeker1_id, 'contacts', [
        { type: 'google', detail: "email@gmail.com" },
        { type: 'mobile', detail: "1122334455" }
      ]).then((doc) => {
        expect(JSON.stringify(doc.contacts)).toContain("email@gmail.com");
        expect(JSON.stringify(doc.contacts)).toContain("1122334455");
        done();
      });
    });

    it('should success update experience field of seeker1 profile', (done) => {
      this.seeker.updateField(seeker1_id, 'experience', [{
        title: "seeker1 experience title",
        company: "seeker1 experience company",
        description: "seeker1 experience description"
      }]).then((doc) => {
        expect(JSON.stringify(doc.experience)).toContain("seeker1 experience title");
        expect(JSON.stringify(doc.experience)).toContain("seeker1 experience company");
        expect(JSON.stringify(doc.experience)).toContain("seeker1 experience description");
        done();
      });
    });

    it('should success update education field of seeker1 profile', (done) => {
      this.seeker.updateField(seeker1_id, 'education', [{
        school: "seeker1 education school",
        field: "seeker1 education field",
        description: "seeker1 education description"
      }]).then((doc) => {
        expect(JSON.stringify(doc.education)).toContain("seeker1 education school");
        expect(JSON.stringify(doc.education)).toContain("seeker1 education field");
        expect(JSON.stringify(doc.education)).toContain("seeker1 education description");
        done();
      });
    });

    it('should success update ksao field of seeker1 profile', (done) => {
      this.seeker.updateField(seeker1_id, 'ksao', [{
        name: "seeker1 ksao name",
        description: "seeker1 ksao description"
      }]).then((doc) => {
        expect(JSON.stringify(doc.ksao)).toContain("seeker1 ksao name");
        expect(JSON.stringify(doc.ksao)).toContain("seeker1 ksao description");
        done();
      });
    });

    it('should success update extra field of seeker1 profile', (done) => {
      this.seeker.updateField(seeker1_id, 'extra', [{
        name: "seeker1 extra name",
        description: "seeker1 extra description"
      }]).then((doc) => {
        expect(JSON.stringify(doc.extra)).toContain("seeker1 extra name");
        expect(JSON.stringify(doc.extra)).toContain("seeker1 extra description");
        done();
      });
    });

    it('should success update tags field of seeker1 profile', (done) => {
      this.seeker.updateField(seeker1_id, 'tags', ["tag1", "tag2"]).then((doc) => {
        expect(JSON.stringify(doc.tags)).toContain("tag1");
        expect(JSON.stringify(doc.tags)).toContain("tag2");
        done();
      });
    });

    it('should not success update invalid field', (done) => {
      this.seeker.updateField(seeker1_id, 'invalid field', [
        { data: "data" }
      ]).catch((error) => {
        expect(error.code).toBe('SEEKER_INVALID_FIELD');
        done();
      });
    });

    it('should not success update field with unregistered seeker', (done) => {
      this.seeker.updateField("5aa995fe3a6e521cdcb6987b", 'contacts', [
        { type: 'google', detail: "email@gmail.com" }
      ]).catch((error) => {
        expect(error.code).toBe('DB_ERROR_NOT_FOUND');
        done();
      });
    });
  });


  describe('src->models->seeker->getField', () => {
    it('should success get contact field of seeker1 profile', (done) => {
      this.seeker.getField(seeker1_id, 'contacts').then((doc) => {
        expect(JSON.stringify(doc)).toContain("email@gmail.com");
        expect(JSON.stringify(doc)).toContain("1122334455");
        done();
      });
    });

    it('should success get experience field of seeker1 profile', (done) => {
      this.seeker.getField(seeker1_id, 'experience').then((doc) => {
        expect(JSON.stringify(doc)).toContain("seeker1 experience title");
        expect(JSON.stringify(doc)).toContain("seeker1 experience company");
        expect(JSON.stringify(doc)).toContain("seeker1 experience description");
        done();
      });
    });

    it('should success get education field of seeker1 profile', (done) => {
      this.seeker.getField(seeker1_id, 'education').then((doc) => {
        expect(JSON.stringify(doc)).toContain("seeker1 education school");
        expect(JSON.stringify(doc)).toContain("seeker1 education field");
        expect(JSON.stringify(doc)).toContain("seeker1 education description");
        done();
      });
    });

    it('should success get ksao field of seeker1 profile', (done) => {
      this.seeker.getField(seeker1_id, 'ksao').then((doc) => {
        expect(JSON.stringify(doc)).toContain("seeker1 ksao name");
        expect(JSON.stringify(doc)).toContain("seeker1 ksao description");
        done();
      });
    });

    it('should success get extra field of seeker1 profile', (done) => {
      this.seeker.getField(seeker1_id, 'extra').then((doc) => {
        expect(JSON.stringify(doc)).toContain("seeker1 extra name");
        expect(JSON.stringify(doc)).toContain("seeker1 extra description");
        done();
      });
    });

    it('should success get tags field of seeker1 profile', (done) => {
      this.seeker.getField(seeker1_id, 'tags').then((doc) => {
        expect(JSON.stringify(doc)).toContain("tag1");
        expect(JSON.stringify(doc)).toContain("tag2");
        done();
      });
    });

    it('should not success get invalid field', (done) => {
      this.seeker.getField(seeker1_id, 'invalid field').catch((error) => {
        expect(error.code).toBe('SEEKER_NOT_COMPLETED');
        done();
      });
    });

    it('should not success get field with unregistered seeker', (done) => {
      this.seeker.getField("5aa995fe3a6e521cdcb6987b", 'contacts').catch((error) => {
        expect(error.code).toBe('SEEKER_NOT_FOUND');
        done();
      });
    });
  });


  describe('src->models->seeker->addSkills', () => {
    it('should success add skills to seeker1 profile', (done) => {
      this.seeker.addSkills(
        seeker1_id,
        [{ name: "skill name1", description: "skill description1" },
        { name: "skill name2", description: "skill description2" }]
      ).then((doc) => {
        expect(JSON.stringify(doc.ksao)).toContain("skill name1");
        expect(JSON.stringify(doc.ksao)).toContain("skill name2");
        expect(JSON.stringify(doc.ksao)).toContain("skill description1");
        expect(JSON.stringify(doc.ksao)).toContain("skill description2");
        done();
      });
    });

    it('should not success add skills unregister id', (done) => {
      this.seeker.addSkills(
        "5aa995fe3a6e521cdcb6987b",
        [{ name: "skill name1", description: "skill description1" },
        { name: "skill name2", description: "skill description2" }]
      ).catch((error) => {
        expect(error.code).toBe('SEEKER_NOT_FOUND');
        done();
      });
    });
  });


  describe('src->models->seeker->addTags', () => {
    it('should success add skill tags to seeker1 profile', (done) => {
      this.seeker.addTags(
        seeker1_id,
        ["tag3", "tag4"]
      ).then((doc) => {
        expect(JSON.stringify(doc.tags)).toContain("tag3");
        expect(JSON.stringify(doc.tags)).toContain("tag4");
        done();
      });
    });

    it('should not success add skill tags unregister id', (done) => {
      this.seeker.addTags(
        "5aa995fe3a6e521cdcb6987b",
        ["tag5", "tag6"]
      ).catch((error) => {
        expect(error.code).toBe('SEEKER_NOT_FOUND');
        done();
      });
    });
  });
});