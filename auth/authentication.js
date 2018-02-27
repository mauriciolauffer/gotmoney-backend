'use strict';

const passport = require('passport');
const isUserAuthenticated = require('./middleware');
const jwtStrategy = require('./jwt');
const localStrategy = require('./local');
const facebookStrategy = require('./facebook');
const googleStrategy = require('./google');

passport.serializeUser((user, done) => {
  const userSession = {
    iduser: user.iduser,
    email: user.email,
    name: user.name
  };
  done(null, userSession);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use('jwt', jwtStrategy.jwt);
  passport.use('local-login', localStrategy.login);
  passport.use('local-signup', localStrategy.signup);
  passport.use('facebook', facebookStrategy.facebook);
  passport.use('google', googleStrategy.google);
  passport.isUserAuthenticated = isUserAuthenticated;
};
