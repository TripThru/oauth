var passport = require('passport');
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var Promise = require('bluebird');

var config = require('../../config');
var User = require('../model/user');
var Client = require('../model/client');
var AccessToken = require('../model/access_token');

passport.use( new ClientPasswordStrategy(
  function(clientId, clientSecret, done){
    Client
      .getByClientId(clientId)
      .then(function(client){
        if(!client) {
        	return done(null, false, { message: 'Invalid credentials' });
        }
        if(client.clientSecret !== clientSecret) {
        	return done(null, false, { message: 'Invalid credentials' });
        }
        return done(null, client);
      })
      .error(function(err){
        done(err);
      });
  }
));

passport.use('access-token', new BearerStrategy(
  function(accessToken, done) {
    AccessToken
      .getByToken(accessToken)
      .then(function(token){
        if(!token) {
        	return done(null, false);
        }
        if(Math.round((Date.now()-token.created)/1000) > config.security.tokenLife) {
          return AccessToken
            .deleteByToken(accessToken)
            .then(function (err){
              done(null, false, { message: 'Token expired' });
            });
        }
        return Promise
          .all([
            User.getById(token.userId),
            Client.getById(token.clientId)
          ])
          .then(function(results){
            var user = results[0];
            var client = results[1];
            if (!user || !client) {
            	return done(null, false, { message: 'Unknown user or client' });
            }
            var info = { scope: user.role };
            done(null, user, info);
          })
      })
      .error(function(err){
        done(err);
      });
  }
));