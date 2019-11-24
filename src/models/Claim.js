const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ClaimSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Claim', ClaimSchema);