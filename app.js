const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

// Import the configured database reference
const { mongoose } = require('./db/mongoose');

// Import the routes
const index = require('./routes/index');
const api = require('./routes/api');
const authenticate = require('./routes/authenticate')(passport);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Passport configuration
app.use(
  session({
    secret: 'super secret'
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
require('./passport-init')(passport);

// Add the routes to the application
app.use('/', index);
app.use('/api', api);
app.use('/auth', authenticate);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
