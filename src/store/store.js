var Promise = require('bluebird');
var knex = require('knex');
var config = require('../../config').db;

function Store() {
  this.db = knex({
    client: 'mysql',
    connection: {
      host: config.host,
      database: config.database,
      user: config.user,
      password: config.password,
    },
    pool: {
      min: 0,
      max: 300
    }
  });
}

Store.prototype.getUserById = function(id) {
  return this
    .db('users')
    .select('*')
    .where('id', id);
};

Store.prototype.getClientById = function(id) {
  return this
    .db('clients')
    .select('*')
    .where('id', id);
};

Store.prototype.getClientByClientId = function(clientId) {
  return this
    .db('clients')
    .select('*')
    .where('client_id', clientId);
};

Store.prototype.getAccessToken = function(token) {
  return this
    .db('access_tokens')
    .select('*')
    .where('token', token);
};

Store.prototype.createAccessToken = function(accessToken) {
  return this
    .db('access_tokens')
    .insert({
      user_id: accessToken.userId,
      client_id: accessToken.clientId,
      token: accessToken.token
    });
};

Store.prototype.deleteAccessTokenByClientId = function(clientId) {
  return this
    .db('access_tokens')
    .where('client_id', clientId)
    .del();
};


module.exports = new Store();