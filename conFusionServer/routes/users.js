var express = require('express');
const bodyParser = require('body-parser');
//const mongoose = require('mongoose');
var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

// allow users to sign up
router.post('/signup', (req, res, next) => {
  // check for duplicate user name
  User.findOne({username: req.body.username})
  .then((user) => {
    if (user != null) {
      var err = new Error('User '+ req.body.username + ' already exists!' );
      err.status = 403;
      next(err);
    }
    else {
      return User.create({
        username: req.body.username,
        password: req.body.password
      });
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration successful', user: user})
  }, (err) => next(err))
  .catch((err) => next(err));
});

// allow user to log in after sign up
router.post('/login', (req, res, next) => {
  if (!req.session.user) {
    // note american spelling... 
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(sendAuthError('You are not authenticated', res, 401));
    }

    // return an array of username and password
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    User.findOne({username: username})
    .then((user) => {
      if (user === null){
        return next(sendAuthError('User ' + username + ' does not exist', res, 403));
      }
      else if (user.password !== password) {
        return next(sendAuthError('Your password is incorrect', res, 403));
      }
      else if (user.username === username && user.password === password) {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!');
      }
    })
    .catch((err) => next(err));
  }
  else // the user is already logged in
  {
    req.statusCode == 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated');
  }
});

// handle user log-out
router.get('/logout', (req, res) => {
  if (req.session) // does the session exists
  {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/'); // to home page
  }
  else {
    next(sendAuthError ('You are not logged in', res, 403));
  }
});

function sendAuthError(message, res, status,) {
  var err = new Error(message); 
  res.setHeader('WWW-Authenticate', 'Basic');
  err.status = status;
  return err;
}


module.exports = router;
