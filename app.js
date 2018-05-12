const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const auth = require('./src/config/auth/auth');


/**
 * Define routes
 */
const index = require('./routes/index');
const users = require('./routes/users');
const seekers = require('./routes/seekers');
const employers = require('./routes/employers');



/**
 * Create a new Express application.
 */
const app = express();



/**
 * View engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



/**
 * Middleware
 */
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(compression()); // compress all responses



/**
 * Set routes
 */
app.use('/', index);
app.use('/users', users);
app.use('/seekers', auth, seekers);
app.use('/employers', auth, employers);




/**
 * Catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



/**
 * Error handler
 */
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
