const BaseStore = require('./BaseStore'),
  model = require('../models/OtpLog'),
  { confirmArguments } = require('../helpers/utility');

function OtpLogStore() {
  this.model = model;
}

OtpLogStore.prototype = Object.create(BaseStore.prototype);

OtpLogStore.prototype.save = function (doc, options, callback) {
  confirmArguments(arguments, 3, () => {
    callback = options;
    options = null;
  });

  Promise.all([generateOTP(3), generateOTP(4)])
    .then(result => {
      let otp = result.join("-");
      doc.code = otp;
      new this.model(doc).save(options, callback);
    });
};

OtpLogStore.prototype.verifyOtp = function (otp, callback) {
  if (!otp || !callback) return callback(new Error("Otp and Callback are required"));

  return this.getOne({ mobile: otp.mobile }, (error, result) => {
    if (error) return callback(error);

    if (otp.code !== result.code) return callback(new Error("Invalid OTP"));

    return this.update({ _id: result._id }, Object.assign(result, {
      verified: true
    }), (error, result) => {
      if (error) return callback(error);

      return callback(null, true);
    });
  });
}

function generateOTP(length = 6) {
  return new Promise((resolve, reject) => {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return resolve(OTP);
  });
}

module.exports = OtpLogStore;