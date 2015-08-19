var store = require('../store/store');
var moment = require('moment');

function toApiClient(storeClient) {
  return {
    id: storeClient.id,
    name: storeClient.name,
    userId: storeClient.user_id,
    clientId: storeClient.client_id,
    clientSecret: storeClient.client_secret
  };
}

function Client() {

}

Client.prototype.getById = function(id) {
  return store
    .getClientById(id)
    .then(function(res){
      return res.length > 0 ? toApiClient(res[0]) : null;
    });
};

Client.prototype.getByClientId = function(clientId) {
  return store
    .getClientByClientId(clientId)
    .then(function(res){
      return res.length > 0 ? toApiClient(res[0]) : null;
    });
};

module.exports = new Client();