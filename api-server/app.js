const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('./models/db')

const indexRouter = require('./routes/index');
const packageRouter = require('./routes/api/packages');
const deliveryRouter = require('./routes/api/deliveries');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../web-apps/dist')));

app.use(/*'/api', */function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader("Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use('/', indexRouter);
app.use('/api', [packageRouter, deliveryRouter])

app.get('/admin/*', function(req, res) {
  res.sendFile('index.html', {root: '../web-apps/dist/admin/'});
});
app.get('/tracker/*', function(req, res) {
  res.sendFile('index.html', {root: '../web-apps/dist/tracker/'});
});
app.get('/driver/*', function(req, res) {
  res.sendFile('index.html', {root: '../web-apps/dist/driver/'});
});
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

module.exports = app;