const BaseStore = require('./BaseStore'),
  model = require('../models/User');

function UserStore () {
  this.model = model;
}

UserStore.prototype = Object.create(BaseStore.prototype);

module.exports = UserStore;