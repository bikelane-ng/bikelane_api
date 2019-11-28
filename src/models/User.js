const mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  Schema = mongoose.Schema,
  config = require('../../config')[process.env.NODE_ENV];

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  confirmedEmail: {
    type: Boolean,
    default: false
  },
  cipherIv: {
    type: String
  },
  role: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Role"
  },
  recentLocation: {
    longitude: {
      type: String
    },
    latitude: {
      type: String
    }
  }
});

UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, config.auth.saltRounds);

  next();
});

UserSchema.methods.confirmPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);