const BaseStore = require('./BaseStore'),
  otpLogStore = new (require('./OtpLogStore'))(),
  model = require('../models/User');

function UserStore() {
  this.model = model;
}

UserStore.prototype = Object.create(BaseStore.prototype);

UserStore.prototype.generateOTP = function (mobile, callback) {
  return otpLogStore.save({ mobile }, callback);
};

module.exports = UserStore;