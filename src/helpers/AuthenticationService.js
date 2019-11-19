module.exports = function (passport, config) {
  const LocalStrategy = require('passport-local').Strategy,
    passportJWT = require("passport-jwt"),
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt,
    userStore = new (require('../repositories/UserStore'))();

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    userStore.getById(id, function (err, user) {
      if (err) throw err;
      done(null, user);
    });
  });

  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    session: true,
    passReqToCallback: true
  }, function (req, username, password, done) {
    userStore.getOne({
      email: new RegExp(username, "gi")
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Invalid credentials.'
        });
      }
      if (req && req.body && req.body.socialToken) {
        let verifyFnMap = {
          GOOGLE: verifyGoogleToken,
          FACEBOOK: verifyFacebookToken
        };
        return verifyFnMap[req.body.socialType](req.body.socialToken)
          .then(tokenInfo => {
            if (tokenInfo.sub !== user.socialId && tokenInfo.user_id !== user.socialId) {
              return done(null, false, {
                message: 'Google token mismatch'
              });
            }
            return done(null, user);
          });
      }
      if (!user.confirmPassword(password)) {
        return done(null, false, {
          message: 'Invalid credentials.'
        });
      }
      return done(null, user);
    });
  }
  ));

  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.auth.secret,
    passReqToCallback: true
  },
    function (req, jwtPayload, done) {
      return userStore.getById(jwtPayload.id, (err, user) => {
        if (err) return done(err);
        delete user.password;
        return done(null, user);
      });
    }
  ));

};
