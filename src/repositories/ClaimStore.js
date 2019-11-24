const BaseStore = require('./BaseStore'),
  model = require('../models/Claim');

function ClaimStore() {
  this.model = model;
}

ClaimStore.prototype = Object.create(BaseStore.prototype);

module.exports = ClaimStore;