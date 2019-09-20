'use strict';

const logger = require('../utils/logger');
const GoogleStrategy = require('passport-google-token').Strategy;
const User = require('../controllers/user');
const mailer = require('../utils/mailer');

const google = new GoogleStrategy({
  clientID: process.env.GOOGLE_APP_ID,
  clientSecret: process.env.GOOGLE_APP_SECRET,
  passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
  req.logout();
  let name = '';
  if (profile.displayName || profile.givenName || profile.familyName) {
    name = (profile.displayName) ? profile.displayName : profile.givenName + profile.familyName;
  }
  const payload = {
    google: profile.id,
    email: profile.email,
    name: name,
  };
  const user = new User();
  let googleUser = {};
  user.findByGoogle(payload.google)
      .then((userFound) => done(null, userFound.getProperties()))
      .catch(() => {
        user.findByEmail(payload.email)
            .then((userFound) => {
              googleUser = userFound;
              googleUser.props.google = payload.google;
              return googleUser.updateGoogle();
            })
            .then(() => done(null, googleUser.getProperties()))
            .catch(() => createUser(payload, done));
      });
});

function createUser(payload, done) {
  payload.birthdate = new Date();
  const user = new User(payload);
  user.setId();
  user.setAutoPassword();
  const password = user.props.passwd;
  user.create()
      .then(() => {
        mailer.sendNewUser(user.props.email, password)
            .then(() => logger.info('Email sent!'))
            .catch((err) => logger.error(err));
        done(null, user.getProperties());
      })
      .catch((err) => done(err, null));
}

module.exports = {
  google,
};
