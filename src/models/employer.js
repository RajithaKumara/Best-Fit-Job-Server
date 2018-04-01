const DbConn = require('../config/database/mongooseConn');
const authUserModel = require('../config/database/mongooseModels/authUserModel');
const employerModel = require('../config/database/mongooseModels/employerModel');
const seekerModel = require('../config/database/mongooseModels/seekerModel');

class Employer {

  constructor() {
    this.dbConn = new DbConn();
  }

  /**Get authenticated user name,email,role by id. */
  getAuthUserById(u_id) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      authUserModel.findById(u_id).then((doc) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        if (doc === null || doc === undefined) {
          let err = {
            code: 'DB_ERROR_AUTH_GET',
            message: 'User id not found.',
            status: ''
          };
          console.log(err.code, ':', err.message, ',_id:', u_id);
          reject(err);
        } else {
          let user = {
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            role: doc.role
          };
          console.log('DB_SUCCESS_AUTH_GET:', user);
          resolve(user);
        }

      }).catch((error) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        console.log('DB_ERROR_AUTH_GET:', error.message, ',_id:', u_id);
        reject(error);

      });
    });
  }

  /**Get authenticated user by id and email. */
  getAuthUserByIdAndEmail(u_id, _email) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      authUserModel.findOne({ _id: u_id, email: _email }, (error, doc) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        if (doc === null || doc === undefined) {
          let err = {
            code: 'DB_ERROR_AUTH_GET_E&I',
            message: 'User id and email mismatch.',
            status: 400
          };
          console.log(err.code, ':', err.message, ',_id:', u_id, ',email:', _email);
          reject(err);
        } else {
          let user = {
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            role: doc.role
          };
          console.log('DB_SUCCESS_AUTH_GET_E&I:', user);
          resolve(user);
        }

      }).catch((error) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        let err = {
          code: 'DB_ERROR_AUTH_GET_E&I',
          message: error.message,
          status: 500
        };
        console.log(err.code, ':', error.message, ',_id:', u_id);
        reject(err);

      });
    });
  }

  /**Verify particular employer exist with id,email. */
  getEmployerByIdAndEmail(u_id, _email) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      employerModel.findOne({ _id: u_id, email: _email }, (error, doc) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        if (doc === null || doc === undefined) {
          let err = {
            code: 'DB_ERROR_GET_E&I',
            message: 'User id and email mismatch.',
            status: 400
          };
          console.log(err.code, ':', err.message, ',_id:', u_id, ',email:', _email);
          reject(err);
        } else {
          console.log('DB_SUCCESS_GET_E&I:', u_id);
          resolve();
        }

      }).catch((error) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        let err = {
          code: 'DB_ERROR_GET_E&I',
          message: error.message,
          status: 500
        };
        console.log(err.code, ':', error.message, ',_id:', u_id);
        reject(err);

      });
    });
  }

  /**Get all details of employer by id. */
  getEmployerById(u_id) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      employerModel.findById(u_id).then((doc) => {
        console.log('DB_SUCCESS_EMP_GET:', u_id);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        if (doc == null || doc == undefined) {
          let err = {
            code: 'EMP_NOT_FOUND',
            message: 'User not found. Please first complete "Create profile" section.',
            status: 400
          };
          reject(err);
        } else {
          let employerProfile = {
            firstName: doc.firstName,
            lastName: doc.lastName,
            country: doc.country,
            summary: doc.summary,
            contacts: doc.contacts,

            companyName: doc.companyName,
            companyUrl: doc.companyUrl,
            date: doc.date,
            companyEmail: doc.companyEmail,
            aboutCompany: doc.aboutCompany,
            jobType: doc.jobType,
            companySize: doc.companySize,
            companyType: doc.companyType,
            tags: doc.tags,
            companyBuilding: doc.companyBuilding,
            companyAddress: doc.companyAddress,
            companyCountry: doc.companyCountry,
            groups: doc.groups
          };
          resolve(employerProfile);

        }
      }).catch((error) => {
        console.log('DB_ERROR:', error.message, ',_id:', u_id);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }
        let err = {
          code: 'DB_ERROR_GET_PROFILE',
          message: error.message,
          status: 500
        };
        reject(err);

      });
    });
  }

  /**Store employer information. */
  storeOwnerInfo(u_id, _email, _data) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      let employer = new employerModel({
        _id: u_id,
        email: _email,
        firstName: _data.firstName,
        lastName: _data.lastName,
        country: _data.country,
        summary: _data.summary,
        contacts: _data.contacts
      });

      employer.save().then((doc) => {
        console.log('DB_SUCCESS_EMP_INSERT:', doc);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        resolve(doc);

      }).catch((error) => {
        console.log('DB_ERROR:', error.message, ',_id:', u_id);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }
        let err = {
          code: 'DB_ERROR_STORE_EMP_INFO',
          message: error.message,
          status: 500
        };
        if (error.code == 11000) {
          err.message = 'Already created profile before. Try update profile.';
          err.status = 400;
        }

        reject(err);

      });
    });
  }

  /**Update employer information. */
  updateOwnerInfo(u_id, _data) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      let updateOwner = {
        firstName: _data.firstName,
        lastName: _data.lastName,
        country: _data.country,
        summary: _data.summary,
        contacts: _data.contacts
      };

      employerModel.findByIdAndUpdate(u_id, { $set: updateOwner }, { new: true }, (error, doc) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        if (error) {
          console.log('DB_ERROR:', error.message, ',_id:', u_id);
          let err = {
            code: 'DB_ERROR_EMP_UPDATE',
            message: error.message,
            status: 500
          };
          reject(err);

        } else {
          if (doc == null || doc == undefined) {
            let err = {
              code: 'DB_ERROR_NOT_FOUND',
              message: 'Employer not found to update.',
              status: 400
            };
            reject(err);
          } else {
            console.log('DB_SUCCESS_EMP_UPDATE:', doc);
            resolve(doc);
          }
        }
      });
    });
  }

  /**Update employer company informations. */
  updateCompanyInfo(u_id, _data) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      let updateCompany = {
        companyName: _data.companyName,
        companyUrl: _data.companyUrl,
        date: _data.date,
        companyEmail: _data.companyEmail,
        aboutCompany: _data.aboutCompany,
        jobType: _data.jobType,
        companySize: _data.companySize,
        companyType: _data.companyType,
        tags: _data.tags,
        companyBuilding: _data.companyBuilding,
        companyAddress: _data.companyAddress,
        companyCountry: _data.companyCountry,
        groups: _data.groups
      };
      console.log(updateCompany);

      employerModel.findByIdAndUpdate(u_id, { $set: updateCompany }, { new: true }, (error, doc) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        if (error) {
          console.log('DB_ERROR:', error.message, ',_id:', u_id);
          let err = {
            code: 'DB_ERROR_EMP_UPDATE',
            message: error.message,
            status: 500
          };
          reject(err);

        } else {
          if (doc == null || doc == undefined) {
            let err = {
              code: 'DB_ERROR_NOT_FOUND',
              message: 'Employer not found to update.',
              status: 400
            };
            reject(err);
          } else {
            console.log('DB_SUCCESS_EMP_UPDATE:', doc);
            resolve(doc);
          }
        }
      });
    });
  }

  /**Retrive owner information from employer profile. */
  getOwnerInfoById(u_id) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      employerModel.findById(u_id).then((doc) => {
        console.log('DB_SUCCESS_EMP_GET:', u_id);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        if (doc == null || doc == undefined) {
          let err = {
            code: 'EMP_NOT_FOUND',
            message: 'User not found. Please first complete "Create profile" section.',
            status: 400
          };
          reject(err);
        } else {
          let employerProfile = {
            firstName: doc.firstName,
            lastName: doc.lastName,
            country: doc.country,
            summary: doc.summary,
            contacts: doc.contacts
          };
          resolve(employerProfile);

        }
      }).catch((error) => {
        console.log('DB_ERROR:', error.message, ',_id:', u_id);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }
        let err = {
          code: 'DB_ERROR_GET_PROFILE',
          message: error.message,
          status: 500
        };
        reject(err);

      });
    });

  }

  /**Retrive company information from employer profile. */
  getCompanyInfoById(u_id) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      employerModel.findById(u_id).then((doc) => {
        console.log('DB_SUCCESS_EMP_GET:', u_id);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        if (doc == null || doc == undefined) {
          let err = {
            code: 'EMP_NOT_FOUND',
            message: 'User not found. Please first complete "Create profile" section.',
            status: 400
          };
          reject(err);
        } else {
          let employerProfile = {
            companyName: doc.companyName,
            companyUrl: doc.companyUrl,
            date: doc.date,
            companyEmail: doc.companyEmail,
            aboutCompany: doc.aboutCompany,
            jobType: doc.jobType,
            companySize: doc.companySize,
            companyType: doc.companyType,
            tags: doc.tags,
            companyBuilding: doc.companyBuilding,
            companyAddress: doc.companyAddress,
            companyCountry: doc.companyCountry,
            groups: doc.groups
          };
          resolve(employerProfile);

        }
      }).catch((error) => {
        console.log('DB_ERROR:', error.message, ',_id:', u_id);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }
        let err = {
          code: 'DB_ERROR_GET_PROFILE',
          message: error.message,
          status: 500
        };
        reject(err);

      });
    });

  }

  /**Get job seekers by maching particular profile field. */
  getSeekerByField(keyWords, field) {
    let searchQuery = this.selectSeekerField(keyWords, field);

    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      seekerModel.find(searchQuery, '_id general contacts experience education ksao extra tags').then((doc) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        resolve(doc);

      }).catch((error) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }
        let err = {
          code: 'DB_ERROR_GET_JOB',
          message: error.message,
          status: 500
        };
        reject(err);

      });
    });
  }

  /**Select job seeker field and build query. */
  selectSeekerField(keyWords, field) {
    let searchThis = new RegExp(keyWords, 'i');
    switch (field) {
      case 'all':
        return {
          $or: [
            { 'general.summary': searchThis },
            { experience: { $elemMatch: { title: searchThis } } },
            { experience: { $elemMatch: { company: searchThis } } },
            { experience: { $elemMatch: { description: searchThis } } },
            { education: { $elemMatch: { school: searchThis } } },
            { education: { $elemMatch: { field: searchThis } } },
            { education: { $elemMatch: { description: searchThis } } },
            { ksao: { $elemMatch: { name: searchThis } } },
            { ksao: { $elemMatch: { description: searchThis } } },
            { extra: { $elemMatch: { name: searchThis } } },
            { extra: { $elemMatch: { description: searchThis } } },
            { tags: searchThis }
          ],
          privacy: false
        };
      case 'summary':
        return {
          'general.summary': searchThis,
          privacy: false
        };
      case 'experience':
        return {
          $or: [
            { experience: { $elemMatch: { title: searchThis } } },
            { experience: { $elemMatch: { company: searchThis } } },
            { experience: { $elemMatch: { description: searchThis } } }
          ],
          privacy: false
        };
      case 'education':
        return {
          $or: [
            { education: { $elemMatch: { school: searchThis } } },
            { education: { $elemMatch: { field: searchThis } } },
            { education: { $elemMatch: { description: searchThis } } }
          ],
          privacy: false
        };
      case 'ksao':
        return {
          $or: [
            { ksao: { $elemMatch: { name: searchThis } } },
            { ksao: { $elemMatch: { description: searchThis } } }
          ],
          privacy: false
        };
      case 'extra':
        return {
          $or: [
            { extra: { $elemMatch: { name: searchThis } } },
            { extra: { $elemMatch: { description: searchThis } } }
          ],
          privacy: false
        };
      case 'tags':
        return {
          tags: searchThis,
          privacy: false
        };
      default:
        return {
          $or: [
            { 'general.summary': searchThis },
            { experience: { $elemMatch: { title: searchThis } } },
            { experience: { $elemMatch: { company: searchThis } } },
            { experience: { $elemMatch: { description: searchThis } } },
            { education: { $elemMatch: { school: searchThis } } },
            { education: { $elemMatch: { field: searchThis } } },
            { education: { $elemMatch: { description: searchThis } } },
            { ksao: { $elemMatch: { name: searchThis } } },
            { ksao: { $elemMatch: { description: searchThis } } },
            { extra: { $elemMatch: { name: searchThis } } },
            { extra: { $elemMatch: { description: searchThis } } },
            { tags: searchThis }
          ],
          privacy: false
        };
    }
  }

}

module.exports = Employer;