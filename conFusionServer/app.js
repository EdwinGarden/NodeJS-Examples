var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
//dishRouter.use(bodyParser.json());
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');

const mongoose = require('mongoose');

const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');

//var uri = "mongodb+srv://EdwinGarden:zThFgB9J1EoJ4OPF@gardencluster01-mkvr1.mongodb.net/node-examples?retryWrites=true";
var uri = config.mongoUrl;
const connect = mongoose.connect(uri);

connect.then((db) => {

  console.log('Connected to the mongo server ');

}, (err) => {
  console.log(err);
});

var app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// the use order here is important
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// we're (not) going to authenticate by session
//app.use(cookieParser('12345-67890-09876-54321'));

// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new fileStore()
// }))

app.use(passport.initialize());
//app.use(passport.session());

// index and users endpoint are open - don't need auth
app.use('/', indexRouter);
app.use('/users', usersRouter);

// require auth before accessing the following
//app.use(auth); // <-- via authenticate.js now

app.use(express.static(path.join(__dirname, 'public')));

// allow all access for GET, check for authorisation for anything else
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// functions
// function auth (req, res, next) {
//   console.log(req.user);
  
//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     return next(err);
//   }
//   else {
//     next();
//   }
// }

module.exports = app;
