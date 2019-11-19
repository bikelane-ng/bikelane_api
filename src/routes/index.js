const crypto = require('crypto'),
  express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  jwt = require('jsonwebtoken'),
  config = require('../../config')[process.env.NODE_ENV],
  { sendErrorResponse, sendOkReponse } = require('../helpers/utility'),
  userStore = new (require('../repositories/UserStore'))(),
  mailer = new (require('../helpers/MailService'))();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function (req, res, next) {
  return userStore.save(req.body, async (error, result) => {
    if (error) return sendErrorResponse(res, error);

    let data = encrypt(JSON.stringify({
      email: req.body.email,
      mobile: req.body.mobile
    }));

    let info = await mailer.sendEmail({
      to: req.body.email,
      subject: "Confirm Email Address",
      context: {
        link: `${req.url}/verifyEmail?h=${data.encryptedData}&s=${req.body.email}` //perhaps replace req.url with a constant server address from config
      }
    });

    console.log(info);

    // return doLocalAuth(req, res);

    return sendOkReponse(res, {
      user: result,
      message: "User email sent successfully"
    });
  });
});

router.post('/login', function (req, res, next) {
  return doLocalAuth(req, res);
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

router.all('/verifyEmail', (req, res) => {
  return userStore.getOne({
    email: req.query.s
  }, (error, user) => {
    if (error) return sendErrorResponse(res, error);

    const decryptedData = JSON.parse(decrypt({
      encryptedData: req.query.h,
      iv: user.cipherIv
    }));

    return userStore.update(decryptedData, {
      $set: {
        confirmedEmail: true
      }
    }, (error, result) => {
      if (error) return sendErrorResponse(res, error);

      return sendOkReponse(res, "Done");
    });

  });
});

function encrypt(data) {
  let iv = crypto.randomBytes(32);

  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(config.auth.secret), iv);

  let encryptedData = cipher.update(data);

  encryptedData = Buffer.concat([encryptedData, cipher.final()]).toString("hex");

  return {
    iv: iv.toString('hex'),
    encryptedData
  };
}

function decrypt(data) {
  const decipher = crypto.createDecipheriv("aes-256-gcm",
    Buffer.from(config.auth.secret), Buffer.from(data.iv, 'hex'));

  let decrypted = crypto.update(data.encryptedData);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}


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
