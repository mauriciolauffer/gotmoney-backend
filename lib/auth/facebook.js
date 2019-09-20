'use strict';

const FacebookStrategy = require('passport-facebook-token');
const User = require('../controllers/user');
const mailer = require('../utils/mailer');

const facebook = new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  enableProof: true,
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  req.logout();
  const payload = {
    facebook: profile.id,
    email: (profile.emails[0]) ? profile.emails[0].value : null,
    name: profile.displayName
  };
  const user = new User();
  let facebookUser = {};
  user.findByFacebook(payload.facebook)
    .then((userFound) => done(null, userFound.getProperties()))
    .catch(() => {
      user.findByEmail(payload.email)
        .then((userFound) => {
          facebookUser = userFound;
          facebookUser.props.facebook = payload.facebook;
          return facebookUser.updateFacebook();
        })
        .then(() => done(null, facebookUser.getProperties()))
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
        .then(() => console.log('Email sent!'))
        .catch((err) => console.error(err));
      done(null, user.getProperties());
    })
    .catch((err) => done(err, null));
}

module.exports = {
  facebook
};
