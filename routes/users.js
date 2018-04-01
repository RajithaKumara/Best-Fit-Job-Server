const express = require('express');
const router = express.Router();
const { redirectURL } = require('../src/data/data');
const UserController = require('../src/controllers/userController');


/* User register as a temparory user. (user name, user email) */
router.post('/register', function (req, res) {
  let userController = new UserController();
  userController.userRegister(req.body).then(() => {
    res.status(200).send();
  }).catch((error) => {
    res.status(500).send(error);
  });
});

/* Redirect to signup page after click on button in verification email */
router.get('/signup/:id', function (req, res) {
  let userController = new UserController();
  userController.tempUserSignUp(req.params.id).then((user) => {
    console.log('user',user)
    res.status(200);
    if (user._id === undefined) {
      res.redirect(redirectURL + '/#/Login/?email=' + user.email.toString());
    } else {
      res.redirect(redirectURL + '/#/userSignUp/?id=' + user._id.toString() + '&email=' + user.email.toString());
    }
  }).catch((error) => {
    res.locals.message = 'Invalid user.';
    res.locals.errorstatus = '400 Bad request.';
    res.status(400);
    res.render('badreq');
  });
});

/* Permanent user signup with password after verifying email. */
router.post('/userSignUp', function (req, res) {
  let userController = new UserController();
  // userController.userSignUp(req.body);
  userController.userSignUp(req.body).then((user) => {
    res.status(200).send(user);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});

/* User logging to home page. */
router.post('/login', function (req, res) {
  let userController = new UserController();
  userController.userLogin(req.body).then((user) => {
    res.status(200).send(user);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

/* Search jobs for unregistered users */
router.post('/searchJobs', function (req, res) {
  let userController = new UserController();
  userController.userSearchJobs(req.body).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(error.status).send(error);
  });
});


module.exports = router;
console.log('users router exported...');
