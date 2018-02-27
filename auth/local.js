'use strict';

const LocalStrategy = require('passport-local').Strategy;
const User = require('../controllers/user');
const mailer = require('../utils/mailer');

const login = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'passwd',
  passReqToCallback: true
}, (req, username, password, done) => {
  req.logout();
  let userFound;
  const user = new User();
  user.findByEmail(username)
    .then((result) => {
      userFound = result;
      return userFound.verifyPassword(password);
    })
    .then(() => done(null, userFound.getProperties()))
    .catch(() => {
      const err = new Error('Invalid username/password!');
      err.status = 401;
      return done(err, null);
    });
});

const signup = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'passwd',
  passReqToCallback: true
}, (req, username, password, done) => {
  req.logout();
  const user = new User(req.body);
  isUsernameAvailable(username)
    .then(() => user.create())
    .then(() => {
      mailer.sendNewUser(user.props.email, password)
        .then(() => console.log('Email sent!'))
        .catch((err) => console.error(err));
      done(null, user.getProperties());
    })
    .catch((err) => done(err, null));
});

function isUsernameAvailable(username) {
  return new Promise((resolve, reject) => {
    const user = new User();
    user.findByEmail(username)
      .then(() => {
        const err = new Error('User already exist! Try another email.');
        err.status = 400;
        return reject(err);
      })
      .catch((err) => {
        if (err.status !== 404) {
          return reject(err);
        }
        return resolve();
      });
  });
}

module.exports = {
  login,
  signup
};
