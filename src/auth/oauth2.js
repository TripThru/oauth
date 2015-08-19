var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');
var config = require('../../config');

var User = require('../model/user');
var Client = require('../model/client');
var AccessToken = require('../model/access_token');

// create OAuth 2.0 server
var aserver = oauth2orize.createServer();

// Generic error handler
var errFn = function (cb, err) {
	if (err) {
		return cb(err);
	}
};

// Destroys any old tokens and generates a new access and refresh token
var generateTokens = function (data, done) {
  return AccessToken
    .deleteByClientId(data.clientId)
    .then(function(){
      var tokenValue = crypto.randomBytes(32).toString('hex');
      data.token = tokenValue;
      return AccessToken
        .create(data)
        .then(function(){
          done(null, tokenValue, {'expires_in': config.security.tokenLife})
        });
    })
    .error(function(err){
      done(err);
    });
};

// Exchange client id and client secret for access token.
aserver.exchange(oauth2orize.exchange.clientCredentials(function(client, scope, done) {
	Client
    .getByClientId(client.clientId)
    .bind({})
    .then(function(c){
      this.client = c;
  		if(!this.client || this.client.clientSecret !== client.clientSecret) {
  			return done(null, false);
  		}
      return User.getById(c.userId);
    })
    .then(function(user){
      if(!user) {
        return done(null, false);
      }
  		var model = {
  			userId: user.id,
  			clientId: this.client.id
  		};
  		return generateTokens(model, done);
  	})
    .error(function(err){
      done(err);
    });
}));

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

function customUnauthorizedHandler(passportStrategy) {
  return function(req, res, next) {
    var r = req;
    passport.authenticate(passportStrategy, function(err, obj, info) {
     if(err) {
       return next(err);
     }
     if(!obj) {
       res.status(401);
       return res.json({
        message: 'Invalid credentials'
       });
     }
     r.user = obj;
     next();
    })(req, res, next);
  };
}

exports.token = [
	customUnauthorizedHandler('oauth2-client-password'),
	aserver.token(),
	aserver.errorHandler()
];
