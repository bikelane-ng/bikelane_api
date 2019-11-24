const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OtpLogSchema = new Schema({
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  expiry: {
    type: Date,
    required: true,
    default: () => Date.now() + 10 * 60 * 1000
  }
});


module.exports = mongoose.model('OtpLog', OtpLogSchema);
