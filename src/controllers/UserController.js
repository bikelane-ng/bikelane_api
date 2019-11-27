const mongoose = require("mongoose"),
  store = new (require("../repositories/UserStore"))(),
  otpStore = new (require("../repositories/OtpLogStore"))(),
  roleStore = new (require("../repositories/RoleStore"))(),
  utility = require("../helpers/utility"),
  smsService = new (require('../helpers/SMSService'))();

function UserController() {
  this.store = store;

  this.save = (req, res) => {
    return this.store.save(req.body, utility.sendReponse(res));
  };

  this.getById = (req, res) => {
    return this.store.getById(req.params.id, utility.sendReponse(res));
  };

  this.getAll = (req, res) => {
    return this.store.get({}, utility.transformListAndSendResponse(res));
  };

  this.updateUserLocation = (req, res) => {
    return this.store.update({ _id: req.user._id }, {
      recentLocation: {
        longitude: req.body.longitude,
        latitude: req.body.latitude
      }
    }, utility.sendReponse(res));
  };

  this.getUserLocation = (req, res) => {
    const _id = req.query.user ? new mongoose.Types.ObjectId(req.query.user) : req.user._id;
    return this.store.getOne({ _id }, { fields: ["recentLocation"] }, utility.sendReponse(res));
  };

  this.register = action => (req, res) => {
    return roleStore.getOne({ name: "REGULAR" }, (error, role) => {
      if (error) return utility.sendErrorResponse(res, error);

      req.body.role = role._id;

      return this.store.save(req.body, (error, result) => {
        if (error) return utility.sendErrorResponse(res, error);

        return action ? action(req, res) : utility.sendOkReponse(res, result);
      });
    });
  };

  this.sendOtpToPhone = (req, res) => {
    let { mobile } = req.body;
    return this.store.getOne({ mobile }, (error, user) => {
      if (error) return utility.sendErrorResponse(res, error);

      if (user) return utility.sendErrorResponse(res, "User has previously signed up");

      return this.store.generateOTP(mobile, (error, otp) => {
        if (error) return utility.sendErrorResponse(res, error);

        return smsService.sendSMS([`+${mobile}`], `Your otp is ${otp.code}. It expires in 10 minutes`, utility.sendReponse(res));
      });
    });
  };

  this.verifyOtp = (req, res) => {
    let { mobile, otp } = req.body;

    return otpStore.verifyOtp({ mobile, code: otp }, utility.sendReponse(res));
  };

  this.verifyEmail = (req, res) => {
    this.store.getOne({
      email: req.query.s
    }, (error, user) => {
      if (error) return utility.sendErrorResponse(res, error);

      const decryptedData = JSON.parse(utility.decrypt({
        encryptedData: req.query.h,
        iv: user.cipherIv
      }));

      return this.store.update(decryptedData, {
        $set: {
          confirmedEmail: true
        }
      }, (error, result) => {
        if (error) return utility.sendErrorResponse(res, error);

        return utility.sendOkReponse(res, "Done");
      });

    });
  };

}

module.exports = UserController;
