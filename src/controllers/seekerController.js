const Analysor = require('../models/analysor');
const Job = require('../models/job');
const Seeker = require('../models/seeker');
const Validator = require('../models/validator');

class SeekerController {

  constructor() {
    this.analysor = new Analysor();
    this.job = new Job();
    this.seeker = new Seeker();
    this.validator = new Validator();
  }

  /**Create seeker and store general information. */
  createSeekerAndGeneralInfo(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let data = obj.data;

    return new Promise((resolve, reject) => {
      //data validation
      let actionValidator = this.actionValidation(obj);
      if (actionValidator.valid === 'INVALID') {
        return reject(actionValidator);
      }
      else {
        //User verification
        this.seeker.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'seeker') {
            //store general informations
            this.seeker.storeGenaralInfo(userId, userEmail, data).then((doc) => {
              let success = {
                code: 'SC_SUCCESS_STORE_GENERAL',
                message: 'Successfully stored general information.',
                status: 201
              };
              return resolve(success);
            }).catch((error) => {
              let err = {
                code: 'SC_ERROR_STORE_GENERAL',
                message: error.message,
                status: error.status
              };
              return reject(err);
            });
          } else {
            let err = {
              code: 'SC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            return reject(err);
          }
        }).catch((error) => {
          let err = {
            code: 'SC_ERROR_AUTH',
            message: error.message,
            status: error.status
          };
          return reject(err);
        });
      }
    });
  }

  /**Update job seeker specific field. */
  seekerUpdateField(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let data = obj.data;
    let action = obj.action;

    return new Promise((resolve, reject) => {
      //data validation
      let actionValidator = this.actionValidation(obj);
      if (actionValidator.valid === 'INVALID') {
        return reject(actionValidator);
      }
      else {
        //User verification
        this.seeker.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'seeker') {
            //update specific field
            this.seeker.updateField(userId, action, data).then((doc) => {
              let success = {
                code: 'SC_SUCCESS_UPDATE_FIELD',
                message: 'Successfully updated ' + action + ' information.',
                status: 200
              };
              return resolve(success);
            }).catch((error) => {
              let err = {
                code: 'SC_ERROR_UPDATE_FIELD',
                message: error.message,
                status: 500
              };
              return reject(err);
            });
          } else {
            let err = {
              code: 'SC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            return reject(err);
          }
        }).catch((error) => {
          let err = {
            code: 'SC_ERROR_AUTH',
            message: error.message,
            status: error.status
          };
          return reject(err);
        });
      }
    });
  }

  /**Retrive job seeker profile specific field. */
  seekerGetField(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let field = obj.action;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'SC_ERROR_GETF_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        return reject(err);
      }
      else {
        //User verification
        this.seeker.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'seeker') {
            //get specific field
            this.seeker.getField(userId, field).then((data) => {
              return resolve(data);

            }).catch((error) => {
              return reject(error);

            });
          } else {
            let err = {
              code: 'SC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            return reject(err);

          }
        }).catch((error) => {
          return reject(error);

        });
      }
    });
  }

  /**Retrive job seeker profile. */
  seekerGetProfile(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'SC_ERROR_GETP_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        return reject(err);
      }
      else {
        //User verification
        this.seeker.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'seeker') {
            //get profile details
            this.seeker.getSeekerById(userId).then((profile) => {
              return resolve(profile);

            }).catch((error) => {
              return reject(error);

            });
          } else {
            let err = {
              code: 'SC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            return reject(err);

          }
        }).catch((error) => {
          return reject(error);

        });
      }
    });
  }

  /**Add new skills to job seeker profile. */
  seekerAddSkills(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let data = obj.data;

    return new Promise((resolve, reject) => {
      //data validation
      let actionValidator = this.actionValidation(obj);
      if (actionValidator.valid === 'INVALID') {
        return reject(actionValidator);
      }
      else {
        //User verification
        this.seeker.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'seeker') {
            //add job seeker new skills
            this.seeker.addSkills(userId, data).then((doc) => {
              let success = {
                code: 'SC_SUCCESS_ADD_SKILLS',
                message: 'Successfully added skills.',
                status: 200
              };
              return resolve(success);

            }).catch((error) => {
              return reject(error);

            });
          } else {
            let err = {
              code: 'SC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            return reject(err);

          }
        }).catch((error) => {
          return reject(error);

        });
      }
    });
  }

  /**Add new skill tags to job seeker profile. */
  seekerAddTags(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let data = obj.data;

    return new Promise((resolve, reject) => {
      //data validation
      let actionValidator = this.actionValidation(obj);
      if (actionValidator.valid === 'INVALID') {
        return reject(actionValidator);
      }
      else {
        //User verification
        this.seeker.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'seeker') {
            //add job seeker new skills
            this.seeker.addTags(userId, data).then((doc) => {
              let success = {
                code: 'SC_SUCCESS_ADD_TAGS',
                message: 'Successfully added tags.',
                status: 200
              };
              return resolve(success);

            }).catch((error) => {
              return reject(error);

            });
          } else {
            let err = {
              code: 'SC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            return reject(err);

          }
        }).catch((error) => {
          return reject(error);

        });
      }
    });
  }

  /**Search job opportunities. */
  seekerSearchJobs(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let keyWords = obj.data;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'SC_ERROR_SEARCH_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        return reject(err);
      }
      else {
        //User verification
        this.seeker.getAuthUserByIdAndEmail(userId, userEmail).then((user) => {
          //Verify user authorization
          if (user.role === 'seeker') {
            //search job opportunities
            this.job.getJobsByAll(keyWords).then((resultsArray) => {
              let allJobs = [];
              resultsArray.forEach((item, index) => {
                allJobs = allJobs.concat(item);
              });

              let newJobArray = [];
              let jobIds = [];
              let employerIds = [];

              allJobs.forEach((item, index) => {
                if (!jobIds.includes(item._id.toString())) {
                  jobIds.push(item._id.toString());
                  newJobArray.push(item);
                  employerIds.push(item.id);
                }
              });

              //if no result found return empty array
              if (newJobArray.length === 0) {
                return resolve([]);
                return;
              }

              //if job results found then search company details for particular jobs
              this.seeker.getBulkEmployers(employerIds).then((companyArray) => {
                return resolve([newJobArray, companyArray]);
              }).catch((error) => {
                return reject(error);

              });

            }).catch((error) => {
              return reject(error);

            });
          } else {
            let err = {
              code: 'SC_ERROR_UNAUTHORIZED',
              message: 'Unauthorized user request.',
              status: 401
            };
            return reject(err);

          }
        }).catch((error) => {
          return reject(error);

        });
      }
    });
  }

  /**Get job suggestions. */
  seekerGetSuggestions(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;
    let category = obj.category;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'SC_ERROR_SUGGEST_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        return reject(err);
      }
      else {
        //User verification,authorization and get seeker profile
        this.seeker.getSeekerByIdAndEmail(userId, userEmail).then((seeker) => {
          if (category === null) {
            //Get job suggestions from analysor
            this.analysor.suggestJob(seeker).then((suggestedJobs) => {
              if (suggestedJobs.length === 0) {
                return resolve({});
                return;
              }

              //Get jobs details which are suggested
              this.job.getJobsByIds(suggestedJobs[0]).then((jobArray) => {
                let employerIds = [];
                jobArray.forEach((job, i) => {
                  employerIds.push(job.id);
                });

                //search company details for suggested jobs
                this.seeker.getBulkEmployers(employerIds).then((companyArray) => {
                  return resolve({
                    suggestedJobs: suggestedJobs,
                    jobs: jobArray,
                    companies: companyArray
                  });
                }).catch((error) => {
                  return reject(error);

                });

              }).catch((error) => {
                return reject(error);

              });

            }).catch((error) => {
              return reject(error);

            });
          } else {
            //Get job list for specified cluster
            this.analysor.getJobCluster(category).then((jobIds) => {
              if (jobIds.length === 0) {
                return resolve({});
                return;
              }

              //Get jobs details from job ids
              this.job.getJobsByIds(jobIds).then((jobArray) => {
                let employerIds = [];
                jobArray.forEach((job, i) => {
                  employerIds.push(job.id);
                });

                //Get company details
                this.seeker.getBulkEmployers(employerIds).then((companyArray) => {
                  return resolve({
                    jobs: jobArray,
                    companies: companyArray
                  });
                }).catch((error) => {
                  return reject(error);

                });

              }).catch((error) => {
                return reject(error);

              });
            }).catch((error) => {

            });
          }

        }).catch((error) => {
          return reject(error);

        });
      }
    });
  }

  /**Get job suggestions summary.(Only categories) */
  seekerGetSuggestSummary(obj) {
    let userId = obj.userId;
    let userEmail = obj.userEmail;

    return new Promise((resolve, reject) => {
      //data validation
      if (!this.validator.isValidObjectID(userId) ||
        !this.validator.isEmail(userEmail)
      ) {
        let err = {
          code: 'SC_ERROR_SUGGEST_VALIDATION',
          message: 'User id or email not valid.',
          status: 400
        }
        return reject(err);
      }
      else {
        //User verification,authorization and get seeker profile
        this.seeker.getSeekerByIdAndEmail(userId, userEmail).then((seeker) => {
          //Get job suggestions from analysor
          this.analysor.suggestJob(seeker).then((suggestedJobs) => {
            if (suggestedJobs.length === 0) {
              return resolve([]);
            } else {
              return resolve(suggestedJobs[2]);
            }

          }).catch((error) => {
            return reject(error);

          });

        }).catch((error) => {
          return reject(error);

        });
      }
    });
  }

  /**Data validate for each action. */
  actionValidation(_obj) {
    let userId = _obj.userId;
    let userEmail = _obj.userEmail;
    let action = _obj.action;
    let data = _obj.data;

    if (!this.validator.isValidObjectID(userId) ||
      !this.validator.isEmail(userEmail)
    ) {
      let err = {
        code: 'SC_VALIDATION_IDENTITY',
        message: 'User id or email invalid.',
        valid: 'INVALID',
        status: 400
      };
      return err;
    } else {
      /**
     * ## Action list ##
     * 
     * general
     * contacts
     * experience
     * education
     * ksao;
     * extra
     * tags
     * 
    . */
      let err = {
        code: 'SC_VALIDATION_DATA_INVALID',
        message: 'Invalid user data.',
        valid: 'INVALID',
        status: 400
      };

      let success = {
        code: 'SC_VALIDATION_DATA_VALID',
        message: 'Valid user data.',
        valid: 'VALID',
        status: 200
      };
      //space for further validation
      switch (action) {
        case 'general':
          return success;
        case 'contacts':
          if (!Array.isArray(data)) {
            return err;
          }
          return success;
        case 'experience':
          if (!Array.isArray(data)) {
            return err;
          }
          return success;
        case 'education':
          if (!Array.isArray(data)) {
            return err;
          }
          return success;
        case 'ksao':
          if (!Array.isArray(data)) {
            return err;
          }
          return success;
        case 'extra':
          if (!Array.isArray(data)) {
            return err;
          }
          return success;
        case 'tags':
          if (!Array.isArray(data)) {
            return err;
          }
          return success;
        default:
          let error = {
            code: 'SC_VALIDATION_ACTION_INVALID',
            message: 'Invalid action request.',
            valid: 'INVALID',
            status: 400
          };
          return error;
      }

    }


  }

}

module.exports = SeekerController;