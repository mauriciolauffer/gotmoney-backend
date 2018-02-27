'use strict';

const passport = require('passport');
const router = require('express').Router();
const User = require('../controllers/user');
const validator = require('../middleware/validate_user');
const mailer = require('../utils/mailer');

router.get('/token', (req, res) => {
  res.status(200).json({csrfToken: req.csrfToken()});
});

router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({});
});

router.get('/loggedin', passport.isUserAuthenticated(), (req, res) => {
  res.status(200).json({});
});

router.post('/login', validator.isValidLogin(), passport.authenticate('local-login'), (req, res) => {
  const userSession = {
    iduser: req.user.iduser,
    email: req.user.email,
    name: req.user.name
  };
  res.status(200).json(userSession);
});

router.post('/facebook', passport.authenticate('facebook'), (req, res) => {
  res.status(200).json({});
});

router.post('/google', passport.authenticate('google'), (req, res) => {
  res.status(200).json({});
});

router.put('/recovery', validator.isValidRecovery(), (req, res, next) => {
  const user = new User();
  const payload = req.body;
  let password;
  user.findByEmail(payload.email)
    .then((userFound) => {
      userFound.setAutoPassword();
      password = userFound.props.passwd;
      return userFound.updatePassword();
    })
    .then(() => {
      mailer.sendRecoveryPassword(payload.email, password)
        .then(() => console.log('Email sent!'))
        .catch((err) => console.error(err));
      res.status(200).json({});
    })
    .catch((err) => next(err));
});

router.post('/signup', validator.isValidSignup(), passport.authenticate('local-signup'), (req, res) => {
  const user = {
    iduser: req.user.iduser,
    email: req.user.email,
    name: req.user.name
  };
  res.status(201).json(user);
});

module.exports = router;
