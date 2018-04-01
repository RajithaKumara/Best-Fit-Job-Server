const DbConn = require('../config/database/mongooseConn');
const jobModel = require('../config/database/mongooseModels/jobModel');

class Job {

  constructor() {
    this.dbConn = new DbConn();
  }

  //
  // + --------------------- +
  // |  Employer's functions |
  // + --------------------- +
  //

  /**Create job opportunity. */
  createJob(u_id, _email, _data) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      let job = new jobModel({
        id: u_id,
        email: _email,
        jobTitle: _data.jobTitle,
        jobDescription: _data.jobDescription,
        contacts: _data.contacts,
        tags: _data.tags,
        url: _data.url,
        online: _data.online,
        salary: _data.salary,
        offers: _data.offers,
        enable: _data.enable,
        privacy: _data.privacy
      });

      job.save().then((doc) => {
        console.log('DB_SUCCESS_JOB_INSERT:', doc);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        resolve(doc);

      }).catch((error) => {
        console.log('DB_ERROR:', error.message, ',_id:', u_id);
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }
        let err = {
          code: 'DB_ERROR_STORE_JOB',
          message: error.message,
          status: 500
        };

        reject(err);

      });
    });
  }

  /**Update job opportunity. */
  updateJob(job_id, _data) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      let job = {
        jobTitle: _data.jobTitle,
        jobDescription: _data.jobDescription,
        contacts: _data.contacts,
        tags: _data.tags,
        url: _data.url,
        online: _data.online,
        salary: _data.salary,
        offers: _data.offers,
        enable: _data.enable,
        privacy: _data.privacy
      };

      jobModel.findByIdAndUpdate(job_id, { $set: job }, { new: true }, (error, doc) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        if (error) {
          console.log('DB_ERROR:', error.message, ',_id:', job_id);
          let err = {
            code: 'DB_ERROR_JOB_UPDATE',
            message: error.message,
            status: 500
          };
          reject(err);

        } else {
          if (doc == null || doc == undefined) {
            let err = {
              code: 'DB_ERROR_NOT_FOUND',
              message: 'Job not found to update.',
              status: 400
            };
            reject(err);
          } else {
            console.log('DB_SUCCESS_JOB_UPDATE:', doc);
            resolve(doc);
          }
        }
      });
    });
  }

  /**Get jobs by employer id. */
  getJobs(u_id) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      jobModel.find({ 'id': u_id }).then((doc) => {
        console.log('DB_SUCCESS_EMP_GET:', u_id);
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

  /**Delete job opportunity. */
  deleteJob(job_id, u_id) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      jobModel.findOneAndRemove({ _id: job_id, id: u_id }, (error, doc) => {
        try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

        if (error) {
          console.log('DB_ERROR:', error.message, ',_id:', job_id);
          let err = {
            code: 'DB_ERROR_JOB_DELETE',
            message: error.message,
            status: 500
          };
          reject(err);

        } else {
          console.log('DB_SUCCESS_JOB_DELETE:', doc._id);
          resolve(doc);
        }
      });
    });
  }


  //
  // + ----------------------- +
  // |  Job Seeker's functions |
  // + ----------------------- +
  //

  /**Get jobs by maching tags. */
  getJobsByTags(keyWords) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      jobModel.find({
        tags: new RegExp(keyWords, 'i'),
        enable: true
      }, '_id id jobTitle jobDescription url salary contacts offers online tags').then((doc) => {

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

  /**Get jobs by job title. */
  getJobsByTitle(keyWords) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      jobModel.find({
        jobTitle: new RegExp(keyWords, 'i'),
        enable: true
      }, '_id id jobTitle jobDescription url salary contacts offers online tags').then((doc) => {

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

  /**Get jobs by job description. */
  getJobsByDescription(keyWords) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      jobModel.find({
        jobDescription: new RegExp(keyWords, 'i'),
        enable: true
      }, '_id id jobTitle jobDescription url salary contacts offers online tags').then((doc) => {

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

  /**Get jobs using job title,job description and tags. */
  getJobsByAll(keyWords) {
    let promiseTitle = this.getJobsByTitle(keyWords);
    let promiseDescription = this.getJobsByDescription(keyWords);
    let promiseTags = this.getJobsByTags(keyWords);

    return Promise.all([promiseTitle, promiseDescription, promiseTags]);
  }

  /**Get set of jobs by job ids. */
  getJobsByIds(job_ids) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      jobModel.find({
        '_id': { $in: job_ids },
        enable: true
      },
        '_id id jobTitle jobDescription url salary contacts offers online tags').then((docSet) => {

          try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }

          resolve(docSet);

        }).catch((error) => {
          try { this.dbConn.closeConnection(mongoose); } catch (e) { console.log(e); }
          let err = {
            code: 'DB_ERROR_GET_JOBS',
            message: error.message,
            status: 500
          };
          reject(err);

        });
    });
  }


  //
  // + ----------------- +
  // |  User's functions |
  // + ----------------- +
  //

  /**Get jobs by maching tags. */
  getPublicJobsByTags(keyWords) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      jobModel.find({
        tags: new RegExp(keyWords, 'i'),
        enable: true,
        privacy: false
      }, '_id id jobTitle jobDescription url salary contacts offers online tags').then((doc) => {

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

  /**Get jobs by job title. */
  getPublicJobsByTitle(keyWords) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      jobModel.find({
        jobTitle: new RegExp(keyWords, 'i'),
        enable: true,
        privacy: false
      }, '_id id jobTitle jobDescription url salary contacts offers online tags').then((doc) => {

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

  /**Get jobs by job description. */
  getPublicJobsByDescription(keyWords) {
    return new Promise((resolve, reject) => {
      let mongoose = this.dbConn.getConnection();

      jobModel.find({
        jobDescription: new RegExp(keyWords, 'i'),
        enable: true,
        privacy: false
      }, '_id id jobTitle jobDescription url salary contacts offers online tags').then((doc) => {

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

  /**Get jobs using job title,job description and tags. */
  getPublicJobsByAll(keyWords) {
    let promiseTitle = this.getPublicJobsByTitle(keyWords);
    let promiseDescription = this.getPublicJobsByDescription(keyWords);
    let promiseTags = this.getPublicJobsByTags(keyWords);

    return Promise.all([promiseTitle, promiseDescription, promiseTags]);
  }
}

module.exports = Job;