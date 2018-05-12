const DbConn = require('../config/database/mongooseConn');
const authUserModel = require('../config/database/mongooseModels/authUserModel');
const seekerModel = require('../config/database/mongooseModels/seekerModel');
const employerModel = require('../config/database/mongooseModels/employerModel');

class Seeker {

  constructor() {
    this.dbConn = new DbConn();
  }

  /**Get authenticated user name,email,role by id. */
  getAuthUserById(u_id) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      authUserModel.findById(u_id).then((doc) => {
        this.dbConn.closeConnection(mongoose);

        if (doc === null || doc === undefined) {
          let err = {
            code: 'DB_ERROR_AUTH_GET',
            message: 'User id not found.',
            status: ''
          };
          console.log(err.code, ':', err.message, ',_id:', u_id);
          return reject(err);
        } else {
          let user = {
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            role: doc.role
          };
          console.log('DB_SUCCESS_AUTH_GET:', user);
          return resolve(user);
        }

      }).catch((error) => {
        this.dbConn.closeConnection(mongoose);

        console.log('DB_ERROR_AUTH_GET:', error.message, ',_id:', u_id);
        return reject(error);

      });
    });
  }

  /**Get authenticated user by id and email. */
  getAuthUserByIdAndEmail(u_id, _email) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      authUserModel.findOne({ _id: u_id, email: _email }, (error, doc) => {
        this.dbConn.closeConnection(mongoose);

        if (doc === null || doc === undefined) {
          let err = {
            code: 'DB_ERROR_AUTH_GET_E&I',
            message: 'User id and email mismatch.',
            status: 400
          };
          console.log(err.code, ':', err.message, ',_id:', u_id, ',email:', _email);
          return reject(err);
        } else {
          let user = {
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            role: doc.role
          };
          console.log('DB_SUCCESS_AUTH_GET_E&I:', user);
          return resolve(user);
        }

      }).catch((error) => {
        this.dbConn.closeConnection(mongoose);

        let err = {
          code: 'DB_ERROR_AUTH_GET_E&I',
          message: error.message,
          status: 500
        };
        console.log(err.code, ':', error.message, ',_id:', u_id);
        return reject(err);

      });
    });
  }

  /**Get all details of seeker by id. */
  getSeekerById(u_id) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      seekerModel.findById(u_id).then((doc) => {
        console.log('DB_SUCCESS_SEEKER_GET:', u_id);
        this.dbConn.closeConnection(mongoose);

        if (doc == null || doc == undefined) {
          let err = {
            code: 'SEEKER_NOT_FOUND',
            message: 'User not found. Please first complete general information in "Create profile" section.',
            status: 400
          };
          return reject(err);
        } else {
          let seekerProfile = {
            general: doc.general,
            contacts: doc.contacts,
            experience: doc.experience,
            education: doc.education,
            ksao: doc.ksao,
            extra: doc.extra,
            tags: doc.tags
          };
          return resolve(seekerProfile);

        }
      }).catch((error) => {
        console.log('DB_ERROR:', error.message, ',_id:', u_id);
        this.dbConn.closeConnection(mongoose);
        let err = {
          code: 'DB_ERROR_GET_PROFILE',
          message: error.message,
          status: 500
        };
        return reject(err);

      });
    });
  }

  /**Get all details of seeker by id and email. */
  getSeekerByIdAndEmail(u_id, _email) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      seekerModel.findOne({ _id: u_id, email: _email },
        'general contacts experience education ksao extra tags').then((doc) => {
          console.log('DB_SUCCESS_SEEKER_GET:', u_id);
          this.dbConn.closeConnection(mongoose);

          if (doc == null || doc == undefined) {
            let err = {
              code: 'SEEKER_NOT_FOUND',
              message: 'User not found.',
              status: 400
            };
            return reject(err);
          } else {
            return resolve(doc);

          }
        }).catch((error) => {
          console.log('DB_ERROR:', error.message, ',_id:', u_id);
          this.dbConn.closeConnection(mongoose);
          let err = {
            code: 'DB_ERROR_GET_PROFILE',
            message: error.message,
            status: 500
          };
          return reject(err);

        });
    });
  }

  /**Store job seeker general information. */
  storeGenaralInfo(u_id, _email, _data) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      let seeker = new seekerModel({
        _id: u_id,
        email: _email,
        general: _data
      });

      seeker.save().then((doc) => {
        console.log('DB_SUCCESS_SEEKER_INSERT:', doc);
        this.dbConn.closeConnection(mongoose);

        return resolve(doc);

      }).catch((error) => {
        console.log('DB_ERROR:', error.message, ',_id:', u_id);
        this.dbConn.closeConnection(mongoose);
        let err = {
          code: 'DB_ERROR_STORE_GEN_INFO',
          message: error.message,
          status: 500
        };
        if (error.code == 11000) {
          err.message = 'Already created profile before. Try update profile.';
          err.status = 400;
        }

        return reject(err);

      });
    });
  }

  /**Update specific field in job seeker profile. */
  updateField(u_id, _field, _data) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      let updatefield = this.selectAction(_field, _data);
      if (updatefield === null){
        let err = {
          code: 'SEEKER_INVALID_FIELD',
          message: "Invalid update field.",
          status: 400
        };
        console.log('SEEKER_ERROR:', err.message, ',_id:', u_id);
        return reject(err);
      }

      seekerModel.findByIdAndUpdate(u_id, { $set: updatefield }, { new: true }, (error, doc) => {
        this.dbConn.closeConnection(mongoose);

        if (error) {
          console.log('DB_ERROR:', error.message, ',_id:', u_id);
          let err = {
            code: 'DB_ERROR_SEEKER_UPDATE',
            message: error.message,
            status: 500
          };
          return reject(err);

        } else {
          if (doc == null || doc == undefined) {
            let err = {
              code: 'DB_ERROR_NOT_FOUND',
              message: 'Seeker not found to update.',
              status: 400
            };
            return reject(err);
          } else {
            console.log('DB_SUCCESS_SEEKER_UPDATE:', u_id);
            return resolve(doc);
          }
        }
      });
    });
  }

  /**Retrive specific job seeker profile field. */
  getField(u_id, _field) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      seekerModel.findById(u_id).then((doc) => {
        this.dbConn.closeConnection(mongoose);

        if (doc == null || doc == undefined) {
          let err = {
            code: 'SEEKER_NOT_FOUND',
            message: 'User not found. Please first complete general information in "Create profile" section.',
            status: 400
          };
          return reject(err);
        } else if (doc[_field] == null) {
          let err = {
            code: 'SEEKER_NOT_COMPLETED',
            message: 'User not completed `' + _field + '` field or invalid field.',
            status: 400
          };
          return reject(err);
        } else {
          let field = JSON.stringify(doc[_field]);

          try {
            field = JSON.parse(field);
            console.log('DB_SUCCESS_SEEKER_GET:', _field, ',_id:', doc._id);
            return resolve(field);
          } catch (e) {
            let err = {
              code: 'SEEKER_UNSTRUCTURED_DATA',
              message: 'User profile data is unstructured in ' + _field + ' field.',
              status: 500
            };
            return reject(err);
          }
        }
      }).catch((error) => {
        console.log('DB_ERROR:', error.message, ',_id:', u_id);
        this.dbConn.closeConnection(mongoose);
        let err = {
          code: 'DB_ERROR_GET_FIELD',
          message: error.message,
          status: 500
        };
        return reject(err);
      });
    });
  }

  /**Add job seeker new skills. */
  addSkills(u_id, _data) {
    let _field = "ksao";
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      seekerModel.findById(u_id).then((doc) => {

        if (doc == null || doc == undefined) {
          let err = {
            code: 'SEEKER_NOT_FOUND',
            message: 'User not found. Please first complete general information in "Create profile" section.',
            status: 400
          };
          return reject(err);
        }
        else {
          let ksao = doc[_field];

          let newKsao = ksao.concat(_data)

          this.updateField(u_id, _field, newKsao).then((newDoc) => {
            return resolve(newDoc);
          }).catch((error) => {
            return reject(error);
          });
        }
      }).catch((error) => {
        console.log('DB_ERROR:', error.message, ',_id:', u_id);
        this.dbConn.closeConnection(mongoose);
        let err = {
          code: 'DB_ERROR_GET_FIELD',
          message: error.message,
          status: 500
        };
        return reject(err);
      });
    });
  }

  /**Add job seeker new skill tags. */
  addTags(u_id, _data) {
    let _field = "tags";
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      seekerModel.findById(u_id).then((doc) => {

        if (doc == null || doc == undefined) {
          let err = {
            code: 'SEEKER_NOT_FOUND',
            message: 'User not found. Please first complete general information in "Create profile" section.',
            status: 400
          };
          return reject(err);
        }
        else {
          let tags = doc[_field];

          let newTags = tags.concat(_data);

          this.updateField(u_id, _field, newTags).then((newDoc) => {
            return resolve(newDoc);
          }).catch((error) => {
            return reject(error);
          });
        }
      }).catch((error) => {
        console.log('DB_ERROR:', error.message, ',_id:', u_id);
        this.dbConn.closeConnection(mongoose);
        let err = {
          code: 'DB_ERROR_GET_FIELD',
          message: error.message,
          status: 500
        };
        return reject(err);
      });
    });
  }

  /**Get bulk of employers details. */
  getBulkEmployers(_ids) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      employerModel.find({ '_id': { $in: _ids } },
        '_id companyName companyUrl date companyEmail aboutCompany companySize companyType companyBuilding companyAddress companyCountry groups').then((docSet) => {

          this.dbConn.closeConnection(mongoose);

          return resolve(docSet);

        }).catch((error) => {
          this.dbConn.closeConnection(mongoose);
          let err = {
            code: 'DB_ERROR_GET_EMP',
            message: error.message,
            status: 500
          };
          return reject(err);

        });
    });
  }

  /**Select action for update seeker field. */
  selectAction(_action, _data) {
    /**
     * ## Action list ##
     * 
     * general
     * contacts
     * experience
     * education
     * ksao
     * extra
     * tags
     * 
    . */
    switch (_action) {
      case 'general':
        return { general: _data };
      case 'contacts':
        return { contacts: _data };
      case 'experience':
        return { experience: _data };
      case 'education':
        return { education: _data };
      case 'ksao':
        return { ksao: _data };
      case 'extra':
        return { extra: _data };
      case 'tags':
        return { tags: _data };
      default:
        return null;
    }
  }

}

module.exports = Seeker;