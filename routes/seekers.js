const express = require('express');
const router = express.Router();
const SeekerController = require('../src/controllers/seekerController');


/* Store job seeker profile information*/
router.post('/createProfile/:action', function (req, res) {
  let action = req.params.action;
  if (req.body.action == action) {
    let seekerController = new SeekerController();
    if (action == 'general') {
      seekerController.createSeekerAndGeneralInfo(req.body).then((result) => {
        res.status(result.status).send(result);
      }).catch((error) => {
        res.status(error.status).send(error);
      });
    } else {
      seekerController.seekerUpdateField(req.body).then((result) => {
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
  let seekerController = new SeekerController()
  seekerController.seekerGetProfile(req.body).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});

/* Update specific field of job seeker profile information */
router.post('/updateProfile/:action', function (req, res) {
  let action = req.params.action;
  if (req.body.action == action) {
    let seekerController = new SeekerController();
    seekerController.seekerUpdateField(req.body).then((result) => {
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

/* Retrive job seeker skills. */
router.post('/fetchSkills', function (req, res) {
  if (req.body.action == "ksao") {
    let seekerController = new SeekerController();
    seekerController.seekerGetField(req.body).then((result) => {
      res.status(200).send(result);
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

/* Add job seeker new skills. */
router.post('/addSkills', function (req, res) {
  let seekerController = new SeekerController();
  seekerController.seekerAddSkills(req.body).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});

/* Add job seeker new skill tags. */
router.post('/addTags', function (req, res) {
  let seekerController = new SeekerController();
  seekerController.seekerAddTags(req.body).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});

/* Search jobs according to user input. */
router.post('/searchJobs', function (req, res) {
  let seekerController = new SeekerController();
  seekerController.seekerSearchJobs(req.body).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});

/* Retrive job suggestions. */
router.post('/getSuggestions', function (req, res) {
  let seekerController = new SeekerController();
  console.log(req.body);
  seekerController.seekerGetSuggestions(req.body).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});

/* Retrive or check, are there any job suggestions for notify job seeker. */
router.post('/getSuggestSummary', function (req, res) {
  let seekerController = new SeekerController();
  console.log(req.body);
  seekerController.seekerGetSuggestSummary(req.body).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});


module.exports = router;
console.log('seekers router exported...');
