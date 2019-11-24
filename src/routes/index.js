const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  jwt = require('jsonwebtoken'),
  config = require('../../config')[process.env.NODE_ENV],
  { sendErrorResponse, sendOkReponse } = require('../helpers/utility'),
  userController = new (require('../controllers/UserController'))(),
  userStore = new (require('../repositories/UserStore'))();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/phone/sendOtp', userController.sendOtpToPhone);

router.post('/phone/verifyOtp', userController.verifyOtp);

router.post('/register', userController.register(doLocalAuth));

router.post('/login', function (req, res, next) {
  return doLocalAuth(req, res);
});

router.post('/token/verify', (req, res) => {
  return jwt.verify(req.body.token, config.auth.secret, function (err, decoded) {
    if (!decoded) {
      return sendErrorResponse(res, "Session has expired");
    }
    return userStore.getById(decoded.id, (err, user) => {
      if (!user) return sendErrorResponse(res, "User was not found");
      return sendOkReponse(res, user);
    })
  });
});

router.all('/verifyEmail', userController.verifyEmail);

function doLogin(req, res, user) {
  return req.login(user, {
    session: false
  }, (err) => {
    if (err) {
      return sendErrorResponse(res, err);
    }
    const token = jwt.sign({
      id: user._id,
      email: user.email,
      mobile: user.mobile
    }, config.auth.secret, { expiresIn: '1h' });

    return sendOkReponse(res, {
      user,
      token
    });
  });
}

function doLocalAuth(req, res) {
  return passport.authenticate('local', {
    session: false
  }, (err, user, info) => {
    if (err || !user) {
      return sendErrorResponse(res, err || (info && info.message));
    }

    return doLogin(req, res, user);
  })(req, res);
}

module.exports = router;
