const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["REGULAR", "DRIVER", "ADMIN"]
  },
  claims: [{
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Claim"
  }]
});

module.exports = mongoose.model('Role', RoleSchema);