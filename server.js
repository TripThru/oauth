var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var config = require('./config');
var log = require('./logger')(module);
var oauth2 = require('./src/auth/oauth2');
var user = require('./src/routes/users');
require('./src/auth/passport_strategies');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(user);
app.use('/oauth/token', oauth2.token);

// catch 404 and forward to error handler
app.use(function(req, res, next){
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({
    	error: 'Not found'
    });
    return;
});

// error handlers
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({
    	error: err.message
    });
    return;
});

app.set('port', config.port);

var server = app.listen(app.get('port'), function() {
  log.info('Express server listening on port ' + config.port);
});