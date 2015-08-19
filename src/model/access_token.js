var store = require('../store/store');
var moment = require('moment');

function toApiAccessToken(storeAccessToken) {
  return {
    userId: storeAccessToken.user_id,
    clientId: storeAccessToken.client_id,
    token: storeAccessToken.token,
    created: moment(storeAccessToken.created)
  };
}

function AccessToken() {

}

AccessToken.prototype.create = function(accessToken) {
  return store.createAccessToken(accessToken);
};

AccessToken.prototype.getByToken = function(token) {
  return store
    .getAccessToken(token)
    .then(function(res){
      return res.length > 0 ? toApiAccessToken(res[0]) : null;
    });
};

AccessToken.prototype.deleteByClientId = function(clientId) {
  return store.deleteAccessTokenByClientId(clientId)
};

module.exports = new AccessToken();