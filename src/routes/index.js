var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../../config')[process.env.NODE_ENV];
var { sendErrorResponse, sendOkReponse } = require('../helpers/utility');
const userStore = new (require('../repositories/UserStore'))();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function (req, res, next) {
  return userStore.save(req.body, (error, result) => {
    if (error) return sendErrorResponse(res, error);

    req.body.username = result.username;
    return passport.authenticate('local', {
      session: false
    }, (err, user, info) => {
      if (err || !user) {
        return sendErrorResponse(res, err);
      }

      return req.login(user, {
        session: false
      }, (err) => {
        if (err) {
          return sendErrorResponse(res, err);
        }
        const token = jwt.sign({
          id: user._id,
          username: user.username,
          rank: user.rank
        }, config.auth.secret, { expiresIn: '1h' });

        return sendOkReponse(res, {
          user,
          token
        });
      });
    })(req, res);
  });
});

router.post('/login', function (req, res, next) {
  return passport.authenticate('local', {
    session: false
  }, (err, user, info) => {
    if (err || !user) {
      return sendErrorResponse(res, err);
    }

    return req.login(user, {
      session: false
    }, (err) => {
      if (err) return sendErrorResponse(res, err);

      const token = jwt.sign({
        id: user._id,
        username: user.username,
        rank: user.rank
      }, config.auth.secret, { expiresIn: '1h' });
      return sendOkReponse(res, {
        user,
        token
      });
    });
  })(req, res);
});

router.post('/verify', (req, res) => {
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


module.exports = router;
