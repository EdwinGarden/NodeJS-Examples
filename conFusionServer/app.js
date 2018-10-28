var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var fileStore = require('session-file-store')(session);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');

const mongoose = require('mongoose');

const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');

var uri = "mongodb+srv://EdwinGarden:zThFgB9J1EoJ4OPF@gardencluster01-mkvr1.mongodb.net/node-examples?retryWrites=true";
const connect = mongoose.connect(uri);

connect.then((db) => {

  console.log('Connected to the mongo server ');

}, (err) => {
  console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// the use order here is important
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// we're going to authenticate by session
//app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new fileStore()
}))

// require auth before accessing the following
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
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
function auth (req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
    // note american spelling... 
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    // return an array of username and password
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    if (username === 'admin' && password === 'password') {
      // all good, save cookie and allow pass through
      //res.cookie('user', 'admin', {signed:true});
      req.session.user = 'admin';
      next();
    }
    else {
      var err = new Error('You are not authenticated"');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

  }
  else // cookie exists, check the user property
  {
    if (req.session.user === 'admin') {
      next();
    }
    else
    {
      var err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);
    }
  }

};

module.exports = app;
