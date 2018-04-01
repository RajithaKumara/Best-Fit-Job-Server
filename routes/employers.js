const express = require('express');
const router = express.Router();
const EmployerController = require('../src/controllers/employerController');


/* Store employer profile information*/
router.post('/createProfile/:action', function (req, res) {
  let action = req.params.action;
  if (req.body.action == action) {
    let employerController = new EmployerController();
    if (action == 'owner') {
      employerController.createEmployerAndOwnerInfo(req.body).then((result) => {
        res.status(result.status).send(result);
      }).catch((error) => {
        res.status(error.status).send(error);
      });
    } else {
      employerController.employerUpdateCompanyInfo(req.body).then((result) => {
        res.status(result.status).send(result);
      }).catch((error) => {
        res.status(error.status).send(error);
      });
    }
  } else {
    let err = {
      code: 'ROUTER_SEEKER_BAD_REQUEST',
      message: "Request couldn't be fulfilled",
      status: 400
    };
    res.status(err.status).send(err);
  }
});

/* Retrive full profile details */
router.post('/fetchProfile', function (req, res) {
  let employerController = new EmployerController();
  employerController.employerGetProfile(req.body).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});

/* Update owner and company information in employer profile */
router.post('/updateProfile/:action', function (req, res) {
  let action = req.params.action;
  let employerController = new EmployerController();
  if (req.body.action == "owner") {
    employerController.employerUpdateOwnerInfo(req.body).then((result) => {
      res.status(result.status).send(result);
    }).catch((error) => {
      res.status(error.status).send(error);
    });
  } else if (req.body.action == "company") {
    employerController.employerUpdateCompanyInfo(req.body).then((result) => {
      res.status(result.status).send(result);
    }).catch((error) => {
      res.status(error.status).send(error);
    });

  } else {
    let err = {
      code: 'ROUTER_SEEKER_BAD_REQUEST',
      message: "Request couldn't be fulfilled",
      status: 400
    };
    res.status(err.status).send(err);
  }
});

/* Add job opportunities. */
router.post('/addJob', function (req, res) {
  let employerController = new EmployerController();
  employerController.employerAddJob(req.body).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});

/* Retrive employer's all job opportunities. */
router.post('/fetchJobs', function (req, res) {
  let employerController = new EmployerController();
  employerController.employerViewJobs(req.body).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});

/* Update employer job opportunities. */
router.post('/updateJob', function (req, res) {
  let employerController = new EmployerController();
  employerController.employerUpdateJob(req.body).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});

/* Delete employer job opportunity. */
router.post('/deleteJob', function (req, res) {
  let action = req.body.data.action;
  console.log(action);
  if (action === 'delete') {
    let employerController = new EmployerController();
    employerController.employerDeleteJob(req.body).then((result) => {
      res.status(200).send(result);
    }).catch((error) => {
      res.status(error.status).send(error);
    });
  } else {
    let err = {
      code: 'ROUTER_EMP_BAD_REQUEST',
      message: "Request couldn't be fulfilled",
      status: 400
    };
    res.status(err.status).send(err);
  }

});

/* Search job seekers according to user input. */
router.post('/searchJobSeekers/:field', function (req, res) {
  let employerController = new EmployerController();
  employerController.employerSearchJobSeekers(req.body,req.params.field).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});


module.exports = router;
console.log('employers router exported...');
