const BaseStore = require('./BaseStore'),
  model = require('../models/Role');

function RoleStore() {
  this.model = model;
}

RoleStore.prototype = Object.create(BaseStore.prototype);

module.exports = RoleStore;