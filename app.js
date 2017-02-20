require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var multiparty = require('connect-multiparty')();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uglifyJs = require("uglify-js");
var passport = require('passport');
var session = require('express-session')

require('./app_api/models/db');
require('./app_api/config/passport');

var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/index');
var connect = require('connect');
var compression = require('compression');
var app_1 = connect();
var app = express();

app_1.use(compression());



// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({extend: false, limit: '60mb', parameterLimit: 10000}));
app.use(bodyParser.urlencoded({ extended: false , limit: '60mb', parameterLimit: 10000}));
//app_1.use(cookieParser());
//app_1.use(express.cookieParser('+crypto.randomBytes(64)+'));
//app_1.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));
app.use(passport.initialize());
//app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + 
//  '/public/uploads' }));
//app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(__dirname + '/static'));
//app.use(express.errorHandler());
app.use('/', routes);
app.use('/api', routesApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
