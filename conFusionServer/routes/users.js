var express = require('express');
const bodyParser = require('body-parser');
//const mongoose = require('mongoose');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate')

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  if (req.user.admin) {
    User.find({})
    .then((users) => {
      console.log('(Get) Return all users ', users);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
  }
  else {
    res.statusCode = 403;
    res.end('(Get) You are not authorized to perform this operation!'); 
  }
});

// allow users to sign up
router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
  req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;

      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});    
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration successful'});
        });
      });
    }
  });
});

// allow user to log in after sign up
router.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({_id: req.user._id});

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are logged in"'});
});

// handle user log-out
router.get('/logout', (req, res) => {
  if (req.session) // does the session exist?
  {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/'); // to home page
  }
  else {
    (sendAuthError ('You are not logged in', res, 403));
  }
});

function sendAuthError(message, res, status,) {
  var err = new Error(message); 
  res.setHeader('WWW-Authenticate', 'Basic');
  err.status = status;
  return err;
}


module.exports = router;
