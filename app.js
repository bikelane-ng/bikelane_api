var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var passport = require('passport');
var config = require('./config')[process.env.NODE_ENV];
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');
var driversRouter = require('./src/routes/drivers');
var claimsRouter = require('./src/routes/claims');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./src/helpers/AuthenticationService')(passport, config);

app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/driver', driversRouter);
app.use('/api/claim', claimsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
