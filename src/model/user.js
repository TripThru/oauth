var store = require('../store/store');
var moment = require('moment');

function toApiUser(storeUser) {
  return {
    id: storeUser.id,
    username: storeUser.username,
    role: storeUser.role
  };
}

function User() {

}

User.prototype.getById = function(id) {
  return store
    .getUserById(id)
    .then(function(res){
      return res.length > 0 ? toApiUser(res[0]) : null;
    });
};

module.exports = new User();