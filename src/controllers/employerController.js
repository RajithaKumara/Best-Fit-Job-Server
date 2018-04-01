const Analysor = require('../models/analysor');
const Employer = require('../models/employer');
const Job = require('../models/job');
const Validator = require('../models/validator');

class EmployerController {

  constructor() {
    this.analysor = new Analysor();
    this.employer = new Employer();
    this.job = new Job();
    this.validator = new Validator();
  }

  /**Create employer and store owner information. */
  createEmployerAndOwnerInfo(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let data = obj.data;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'EC_ERROR_STORE_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        reject(err);
      }
      else {
        //User verification
        this.employer.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'employer') {
            //store general informations
            this.employer.storeOwnerInfo(userId, userEmail, data).then((doc) => {
              let success = {
                code: 'EC_SUCCESS_STORE_EMP',
                message: 'Successfully stored general information.',
                status: 201
              };
              resolve(success);
            }).catch((error) => {
              let err = {
                code: 'EC_ERROR_STORE_EMP',
                message: error.message,
                status: error.status
              };
              reject(err);
            });
          } else {
            let err = {
              code: 'EC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            reject(err);
          }
        }).catch((error) => {
          let err = {
            code: 'EC_ERROR_AUTH',
            message: error.message,
            status: error.status
          };
          reject(err);
        });
      }
    });

  }

  /**Update employer owner information. */
  employerUpdateOwnerInfo(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let data = obj.data;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'EC_ERROR_UPDATE_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        reject(err);
      }
      else {
        //User verification
        this.employer.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'employer') {
            //update specific field
            this.employer.updateOwnerInfo(userId, data).then((doc) => {
              let success = {
                code: 'EC_SUCCESS_UPDATE_OWNER',
                message: 'Successfully updated owner information.',
                status: 200
              };
              resolve(success);
            }).catch((error) => {
              let err = {
                code: 'EC_ERROR_UPDATE_OWNER',
                message: error.message,
                status: 500
              };
              reject(err);
            });
          } else {
            let err = {
              code: 'EC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            reject(err);
          }
        }).catch((error) => {
          let err = {
            code: 'EC_ERROR_AUTH',
            message: error.message,
            status: error.status
          };
          reject(err);
        });
      }
    });

  }

  /**Update employer company information. */
  employerUpdateCompanyInfo(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let data = obj.data;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'EC_ERROR_UPDATE_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        reject(err);
      }
      else {
        //User verification
        this.employer.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'employer') {
            //update specific field
            this.employer.updateCompanyInfo(userId, data).then((doc) => {
              let success = {
                code: 'EC_SUCCESS_UPDATE_COMPANY',
                message: 'Successfully updated company information.',
                status: 200
              };
              resolve(success);
            }).catch((error) => {
              let err = {
                code: 'EC_ERROR_UPDATE_COMPANY',
                message: error.message,
                status: 500
              };
              reject(err);
            });
          } else {
            let err = {
              code: 'EC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            reject(err);
          }
        }).catch((error) => {
          let err = {
            code: 'EC_ERROR_AUTH',
            message: error.message,
            status: error.status
          };
          reject(err);
        });
      }
    });

  }

  /**Retrive employer profile owner informations. */
  employerGetOwnerInfo(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'EC_ERROR_GET_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        reject(err);
      }
      else {
        //User verification
        this.employer.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'employer') {
            //get owner infromation from employer profile
            this.employer.getOwnerInfoById(userId).then((data) => {
              resolve(data);

            }).catch((error) => {
              reject(error);

            });
          } else {
            let err = {
              code: 'EC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            reject(err);

          }
        }).catch((error) => {
          reject(error);

        });
      }
    });

  }

  /**Retrive employer profile company informations. */
  employerGetCompanyInfo(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'EC_ERROR_GET_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        reject(err);
      }
      else {
        //User verification
        this.employer.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'employer') {
            //get company infromation from employer profile
            this.employer.getCompanyInfoById(userId).then((data) => {
              resolve(data);

            }).catch((error) => {
              reject(error);

            });
          } else {
            let err = {
              code: 'EC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            reject(err);

          }
        }).catch((error) => {
          reject(error);

        });
      }
    });

  }

  /**Retrive employer profile. */
  employerGetProfile(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'EC_ERROR_GET_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        reject(err);
      }
      else {
        //User verification
        this.employer.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'employer') {
            //get profile details
            this.employer.getEmployerById(userId).then((profile) => {
              resolve(profile);

            }).catch((error) => {
              reject(error);

            });
          } else {
            let err = {
              code: 'EC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            reject(err);

          }
        }).catch((error) => {
          reject(error);

        });
      }
    });
  }

  /**Add job opportunity. */
  employerAddJob(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let data = obj.data;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'EC_ERROR_ADD_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        reject(err);
      }
      else {
        //Employer verification and authorization
        this.employer.getEmployerByIdAndEmail(userId, userEmail).then((user) => {

          this.job.createJob(userId, userEmail, data).then((doc) => {

            //Analyze and categorize
            this.analysor.categorizeJob(
              doc._id.toString(),
              doc.jobTitle,
              doc.jobDescription,
              doc.tags
            );

            let success = {
              code: 'EC_SUCCESS_ADD_JOB',
              message: 'Successfully added job.',
              status: 200
            };
            resolve(success);

          }).catch((error) => {
            reject(error);

          });

        }).catch((error) => {
          reject(error);

        });
      }
    });
  }

  /**View job opportunities. */
  employerViewJobs(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'EC_ERROR_VIEW_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        reject(err);
      }
      else {
        //Employer verification and authorization
        this.employer.getEmployerByIdAndEmail(userId, userEmail).then((user) => {
          //Retrive jobs
          this.job.getJobs(userId).then((jobs) => {

            resolve(jobs);

          }).catch((error) => {
            reject(error);

          });
        }).catch((error) => {
          reject(error);

        });
      }
    });
  }

  /**Update job opportunity. */
  employerUpdateJob(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let data = obj.data;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'EC_ERROR_UPDATE_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        reject(err);
      }
      else {
        //Employer verification and authorization
        this.employer.getEmployerByIdAndEmail(userId, userEmail).then((user) => {
          //Update job
          this.job.updateJob(data._id, data).then((doc) => {
            //Analyze and update clusters
            this.analysor.reCategorizeJob(
              data._id.toString(),
              data.jobTitle,
              data.jobDescription,
              data.tags
            );

            let success = {
              code: 'EC_SUCCESS_UPDATE_JOB',
              message: 'Successfully updated job.',
              status: 200
            };
            resolve(success);

          }).catch((error) => {
            reject(error);

          });

        }).catch((error) => {
          reject(error);

        });
      }
    });
  }

  /**Delete job opportunity. */
  employerDeleteJob(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let data = obj.data;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'EC_ERROR_DELETE_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        reject(err);
      }
      else {
        //Employer verification and authorization
        this.employer.getEmployerByIdAndEmail(userId, userEmail).then((user) => {

          this.job.deleteJob(data._id, userId).then((doc) => {
            //Remove job from clusters
            this.analysor.removeJob(data._id.toString());

            let success = {
              code: 'EC_SUCCESS_DELETE_JOB',
              message: 'Successfully deleted job.',
              status: 200
            };
            resolve(success);

          }).catch((error) => {
            reject(error);

          });
        }).catch((error) => {
          reject(error);

        });
      }
    });
  }

  /**Search job seekers. */
  employerSearchJobSeekers(obj,field) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let keyWords = obj.data;
    console.log(field)

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'EC_ERROR_SEARCH_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        reject(err);
      }
      else {
        //User verification
        this.employer.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'employer') {
            //search job seekers
            this.employer.getSeekerByField(keyWords,field).then((resultArray)=>{
              resolve(resultArray);
              
            }).catch((error)=>{
              reject(error);

            });
          } else {
            let err = {
              code: 'EC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            reject(err);

          }
        }).catch((error) => {
          reject(error);

        });
      }
    });
  }

}

module.exports = EmployerController;