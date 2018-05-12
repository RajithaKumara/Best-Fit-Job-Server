const RedisConn = require('../config/database/redisConn');
const request = require('request');
const jobModel = require('../config/database/mongooseModels/jobModel');
const { RedisClient, Multi } = require('redis');
const {
  dictionaryURL,
  dictionaryAppId,
  dictionaryAppKey,
  googleLanguageApiURL,
  googleLanguageApiKey,
  defaultCluster
} = require('../data/data');

class Analysor {

  constructor() {
    this.redisConn = new RedisConn();
  }

  //
  // + --------------------- +
  // |  Employer's functions |
  // + --------------------- +
  //

  /**
   * Categorize job and assign to clusters.
   * @param {string} jobId Job objectId from main database
   * @param {string} jobTitle Job title
   * @param {string} jobDescription Job description
   * @param {string[]} tags Tags which are belongs to the job
   */
  categorizeJob(jobId, jobTitle, jobDescription, tags) {
    return new Promise((resolve, reject) => {
      this.classifyJob(jobTitle, jobDescription, tags).then((array) => {
        let categoriesArray = array[0].concat(array[1]);
        //Append default cluster if not have any cluster
        if (categoriesArray.length === 0) {
          categoriesArray.push(defaultCluster);
        }

        let client = this.redisConn.getConnection();
        let multi = client.multi(); //Start transaction

        //Map category array to particular job(job id).
        this.setJobCategories(multi, jobId, categoriesArray);

        //Put into specified clusters
        Array.from(new Set(categoriesArray)).forEach((clusterLabel, index) => {
          this.addToCluster(multi, clusterLabel, jobId);
        });

        //Transaction execution
        multi.exec((err, reply) => {
          this.redisConn.closeConnection(client);

          if (err) {
            return reject(err);
          } else {
            return resolve("Clustering finish");
          }
        });

      }).catch((error) => {
        return reject(error);
      });

    });
  }

  /**
   * Re-categorize job and update clusters.
   * @param {string} jobId Job objectId from main database
   * @param {string} jobTitle New job title
   * @param {string} jobDescription New job description
   * @param {string[]} tags New tags which are belongs to the job
   */
  reCategorizeJob(jobId, jobTitle, jobDescription, tags) {
    return new Promise((resolve, reject) => {
      let newJobCategoriesArray = this.classifyJob(jobTitle, jobDescription, tags);
      let jobCategoriesArray = this.getJobCategories(jobId);

      Promise.all([newJobCategoriesArray, jobCategoriesArray]).then((array) => {
        let newJobCategoriesArray = array[0][0].concat(array[0][1]);
        let jobCategoriesArray = array[1];

        if (JSON.stringify(jobCategoriesArray.sort()) != JSON.stringify(newJobCategoriesArray.sort())) {

          let allJobCategoriesSet = new Set(newJobCategoriesArray);
          let newJobCategoriesSet = new Set(newJobCategoriesArray);
          let jobCategoriesSet = new Set(jobCategoriesArray);

          //Remove intersection from two Sets
          let intersection = [];
          for (let j = 0; j < newJobCategoriesArray.length; j++) {
            let itemJ = newJobCategoriesArray[j];
            for (let i = 0; i < jobCategoriesArray.length; i++) {
              let itemI = jobCategoriesArray[i];
              if (itemJ === itemI) {
                newJobCategoriesSet.delete(itemJ);
                jobCategoriesSet.delete(itemI);
                break;
              }
            }
          }

          //Append default cluster if not have any cluster
          let allCategoriesArray = Array.from(allJobCategoriesSet);
          let newCategoriesArray = Array.from(newJobCategoriesSet);
          let oldCategoriesArray = Array.from(jobCategoriesSet);
          if (allCategoriesArray.length === 0) {
            newCategoriesArray.push(defaultCluster);
            allCategoriesArray.push(defaultCluster);
          }

          let client = this.redisConn.getConnection();
          let multi = client.multi(); //Start transaction

          //Update category array to particular job(job id).
          this.setJobCategories(multi, jobId, allCategoriesArray);

          //Remove from old clusters
          oldCategoriesArray.forEach((clusterLabel, index) => {
            this.removeFromCluster(multi, clusterLabel, jobId);
          });

          //Add into new clusters
          newCategoriesArray.forEach((clusterLabel, index) => {
            this.addToCluster(multi, clusterLabel, jobId);
          });

          //Transaction execution
          multi.exec((err, reply) => {
            this.redisConn.closeConnection(client);

            if (err) {
              return reject(err);
            } else {
              return resolve("Cluster update finish");
            }
          });

        } else {
          return resolve("Cluster update finish with no changes.");
        }

      }).catch((error) => {
        return reject(error);
      });
    });
  }

  /**
   * Remove job from jobs table and clusters.
   * @param {string} jobId Job objectId from main database
   */
  removeJob(jobId) {
    return new Promise((resolve, reject) => {

      this.getJobCategories(jobId).then((categoriesArray) => {
        
        if (categoriesArray === null || categoriesArray.length === 0) {
          return reject("Not found");
          return;
        }

        let client = this.redisConn.getConnection();
        let multi = client.multi(); //Start transaction

        //Remove job from jobs table
        this.removeJobFromTable(multi, jobId);

        //Remove from all clusters
        categoriesArray.forEach((clusterLabel, index) => {
          this.removeFromCluster(multi, clusterLabel, jobId);
        });

        //Transaction execution
        multi.exec((err, reply) => {
          this.redisConn.closeConnection(client);

          if (err) {
            return reject(err);
          } else {
            return resolve("Cluster delete finish");
          }
        });

      }).catch((error) => {
        return reject(error);
      });
    });
  }


  //
  // + ----------------------- +
  // |  Job Seeker's functions |
  // + ----------------------- +
  //

  /**
   * Suggest jobs from suitable clusters according to job seeker profile.
   * @param {JSON} seeker Job seeker profile
   */
  suggestJob(seeker) {
    return new Promise((resolve, reject) => {
      this.classifyJobBySeekerProfile(seeker).then((array) => {
        let categoriesArray = array[0].concat(array[1]);
        //Append default cluster if not have any cluster
        if (categoriesArray.length === 0) {
          categoriesArray.push(defaultCluster);
        }

        let client = this.redisConn.getConnection();
        let batch = client.batch(); //Start batch process

        //Get jobs from particular clusters
        let jobClusterArray = [];
        Array.from(new Set(categoriesArray)).forEach((clusterLabel, index) => {
          //Promise push into a array
          jobClusterArray.push(this.getCluster(batch, clusterLabel));
        });

        //Batch process execution
        batch.exec((err, reply) => {
          this.redisConn.closeConnection(client);

          if (err) {
            return reject(err);
          } else {
            //Collect requested cluster content
            Promise.all(jobClusterArray).then((clustersArray) => {
              let jobArray = [];
              clustersArray.forEach((cluster, i) => {
                let tempArray = jobArray.concat(cluster)
                jobArray = Array.from(new Set(tempArray));
              });

              //if there are no suggestions
              if (jobArray.length === 0) {
                return resolve([]);
                return;
              }

              this.getJobCategoriesBulk(jobArray).then((categories) => {
                return resolve([jobArray, categories, categoriesArray]);
              }).catch((error) => {
                return reject(error);
              });

            }).catch((error) => {
              return reject(error);

            });
          }
        });

      }).catch((error) => {
        return reject(error);
      });

    });
  }

  /**
   * Get job list for particular cluster.
   * @param {string} cluster Cluster label which want to search
   */
  getJobCluster(cluster) {
    return new Promise((resolve, reject) => {
      let client = this.redisConn.getConnection();

      this.getCluster(client, cluster).then((jobArray) => {
        return resolve(jobArray);
      }).catch((error) => {
        return reject(error);
      })
    });
  }

  /**
   * 
   */
  addNewTag() {

  }


  //
  // + ----------------- +
  // |  Common functions |
  // + ----------------- +
  //

  /**Clasify text using google natural language api.
   * Content Categories:
   * https://cloud.google.com/natural-language/docs/categories
   * @param {string} text Plain text want to classify
   */
  classifyByText(text) {
    return new Promise((resolve, reject) => {
      request({
        url: googleLanguageApiURL + ":classifyText?key=" + googleLanguageApiKey,
        method: 'POST',
        json: {
          "document": {
            "type": "PLAIN_TEXT",
            "content": text,
          },
        },
        //timeout: 3000
      }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let categories = [];
          try {
            body.categories.forEach((category, index) => {
              if (category.confidence > 0.5) {
                categories.push(category.name);
              }
            });
          } catch (error) {
            console.log(error);
          }
          return resolve(categories);
        } else if (error) {
          return resolve([]);
        } else if (response.statusCode === 400) {
          return resolve([]);
        } else {
          return reject([]);
        }
      });
    });
  }

  /**
   * Categorize job by considering job title, job description and tags.
   * @param {string} jobTitle Job title
   * @param {string} jobDescription Job description
   * @param {string[]} tags Tags which are belongs to the job
   */
  classifyJob(jobTitle, jobDescription, tags) {
    let text = jobTitle + " :- " + jobDescription;
    let classifyByText = this.classifyByText(text);

    let classifyByTags = this.classifyByTags(tags);

    return Promise.all([classifyByText, classifyByTags]);
  }

  /**
   * Return best fit job categories according to job seeker full profile.
   * @param {JSON} seeker Job seeker profile
   */
  classifyJobBySeekerProfile(seeker) {
    let summary = "";
    let experience = [];
    let education = [];
    let ksao = [];
    let extra = [];
    let tags = [];

    let general = seeker.general;
    if (general != undefined || general != null) summary = general.summary + ".";
    if (Array.isArray(seeker.experience)) experience = seeker.experience;
    if (Array.isArray(seeker.education)) education = seeker.education;
    if (Array.isArray(seeker.ksao)) ksao = seeker.ksao;
    if (Array.isArray(seeker.extra)) extra = seeker.extra;
    if (Array.isArray(seeker.tags)) tags = seeker.tags;

    let maxLength = experience.length;
    if (education.length > maxLength) maxLength = education.length;
    if (ksao.length > maxLength) maxLength = ksao.length;
    if (extra.length > maxLength) maxLength = extra.length;

    let experienceText = "";
    let educationText = "";
    let ksaoText = "";
    let extraText = "";
    for (let i = 0; i < maxLength; i++) {
      try {
        experienceText += "I have experience in" + experience[i].title + ":-" + experience[i].description + ".";
      } catch (error) { }

      try {
        educationText += education[i].field + ":-" + education[i].description + ".";
      } catch (error) { }

      try {
        ksaoText += ksao[i].name + ":-" + ksao[i].description + ".";
      } catch (error) { }

      try {
        extraText += extra[i].name + ":-" + extra[i].description + ".";
      } catch (error) { }
    }

    let text = summary + experienceText + educationText + ksaoText + extraText;

    let classifyByText = this.classifyByText(text);
    let classifyByTags = this.classifyByTags(tags);

    return Promise.all([classifyByText, classifyByTags]);
  }

  dictionaryRequest(text) {
    let word = text.toLowerCase().replace(/ /g, "_");
    let uri = dictionaryURL + word + "/definitions";

    return new Promise((resolve, reject) => {
      request({
        url: encodeURI(uri),
        method: 'GET',
        headers: {
          "Accept": "application/json",
          "app_id": dictionaryAppId,
          "app_key": dictionaryAppKey
        },
        timeout: 3000
      }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          return resolve(body);
        } if (response.statusCode == 404) {
          return resolve({});
        } else {
          return reject(error);
        }
      });
    });
  }


  //
  // + ------------------ +
  // |  Storage functions |
  // + ------------------ +
  //

  /**
   * Set the category of a hash tag, only if the tag does not exist. 
   * @param {string} tag New tag name introduced by system users
   * @param {string} category Category name the particular tag belongs to.
   * */
  mapNewTag(tag, category) {
    return new Promise((resolve, reject) => {
      let client = this.redisConn.getConnection();

      client.hsetnx("map", tag, category, (err, reply) => {
        this.redisConn.closeConnection(client);

        if (err) {
          return reject(err);
        } else {
          return resolve(reply);
        }
      })
    });
  }

  /**
   * Set bulk of tag, category pairs for administration purposes. 
   * @param {JSON} object Tag,category pairs as a JSON object
   * */
  mapNewTagBulk(object) {
    return new Promise((resolve, reject) => {
      let client = this.redisConn.getConnection();

      client.hmset("map", object, (err, reply) => {
        this.redisConn.closeConnection(client);

        if (err) {
          return reject(err);
        } else {
          return resolve(reply);
        }
      })
    });
  }

  /**
   * Return category array for the given tags array.
   * If does not exist any tag in tags array assign `null` for particular result.
   * @param {string[]} tags Tags which are belongs to the job
   */
  classifyByTags(tags) {
    return new Promise((resolve, reject) => {
      if (tags.length === 0) {
        return resolve([]);
        return;
      }

      let client = this.redisConn.getConnection();

      client.hmget("map", tags, (err, array) => {
        this.redisConn.closeConnection(client);

        if (err) {
          return reject(err);
        } else {
          let categoriesArray = Array.from(new Set(array));
          let nullIndex = categoriesArray.indexOf(null);
          if (nullIndex != -1) {
            categoriesArray.splice(nullIndex, 1);
          }
          return resolve(categoriesArray);
        }
      });
    });
  }

  /**
   * Add new category into "categories" list.
   * The "categories" list have system avilable job categories.
   * Not all the categories.
   * @param {string} category
   * */
  addNewCategories(category) {
    return new Promise((resolve, reject) => {
      let client = this.redisConn.getConnection();

      //get all categories from "categories" list
      client.lrange("categories", 0, -1, (err, categoriesArray) => {
        if (err) {
          return reject(err);
        } else {
          //check category name already exist in the list
          let index = categoriesArray.indexOf(category);
          if (index >= 0) {
            this.redisConn.closeConnection(client);

            return reject("Already exist.");
          } else {
            //push into "categories" list the new category
            client.lpush("categories", category, (err, reply) => {
              this.redisConn.closeConnection(client);

              if (err) {
                return reject(err);
              } else {
                return resolve(reply);
              }
            });
          }
        }
      });
    });
  }

  /**
   * Set category array for particular job(Add & Update).
   * @param {RedisClient|Multi} client Redis database connection
   * @param {string} jobId Job objectId from main database
   * @param {string[]} categoryArray Array of category names which are match to particular job
   * */
  setJobCategories(client, jobId, categoryArray) {
    return new Promise((resolve, reject) => {
      client.hset("jobs", jobId, JSON.stringify(categoryArray), (err, reply) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(reply);
        }
      });
    });
  }

  /**
   * Return category array for particular job.
   * @param {string} jobId Job objectId from main database
   * */
  getJobCategories(jobId) {
    return new Promise((resolve, reject) => {
      let client = this.redisConn.getConnection();

      client.hget("jobs", jobId, (err, reply) => {
        this.redisConn.closeConnection(client);
        if (err) {
          return reject(err);
        } else if (reply === null) {
          return resolve([]);
        } else {
          return resolve(JSON.parse(reply));
        }
      });
    });
  }

  /**
   * Return categories array for particular job set.
   * @param {string[]} jobIds Job objectIds from main database
   * */
  getJobCategoriesBulk(jobIds) {
    return new Promise((resolve, reject) => {
      let client = this.redisConn.getConnection();

      client.hmget("jobs", jobIds, (err, reply) => {
        this.redisConn.closeConnection(client);
        if (err) {
          return reject(err);
        } else if (reply === null) {
          return resolve([]);
        } else {
          return resolve(reply);
        }
      });
    });
  }

  /**
   * Remove job from "jobs" hash table.
   * @param {RedisClient|Multi} client Redis database connection
   * @param {string} jobId Job objectId from main database
   * */
  removeJobFromTable(client, jobId) {
    return new Promise((resolve, reject) => {
      client.hdel("jobs", jobId, (err, reply) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(reply);
        }
      });
    });
  }

  /**
   * Add job to particular cluster. 
   * @param {RedisClient|Multi} client Redis database connection
   * @param {string} cluster Cluster label from category list
   * @param {string} jobId Job objectId from main database
   * */
  addToCluster(client, cluster, jobId) {
    return new Promise((resolve, reject) => {
      client.lpush(cluster, jobId, (err, reply) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(reply);
        }
      });
    });
  }

  /**
   * Remove job from given cluster. 
   * @param {RedisClient|Multi} client Redis database connection
   * @param {string} cluster Cluster label from category list
   * @param {string} jobId Job objectId from main database
   * */
  removeFromCluster(client, cluster, jobId) {
    return new Promise((resolve, reject) => {
      client.lrem(cluster, 0, jobId, (err, reply) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(reply);
        }
      });
    });
  }

  /**
   * Rerurn all jobs in particular cluster. 
   * @param {RedisClient|Multi} client Redis database connection
   * @param {string} cluster Cluster label from category list
   * */
  getCluster(client, cluster) {
    return new Promise((resolve, reject) => {
      //get all jobs from particular cluster(list)
      client.lrange(cluster, 0, -1, (err, jobs) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(jobs);
        }
      });
    });
  }

}

module.exports = Analysor;