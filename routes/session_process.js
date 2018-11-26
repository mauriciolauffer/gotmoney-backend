'use strict';

const User = require('../controllers/user');
const mailer = require('../utils/mailer');

function ok(req, res) {
  return res.status(200).json({});
}

function userLogin(req, res) {
  const userSession = {
    iduser: req.user.iduser,
    email: req.user.email,
    name: req.user.name
  };
  return res.status(200).json(userSession);
}

function userLogout(req, res) {
  req.logout();
  return res.status(200).json({});
}

function userSignup(req, res) {
  const user = {
    iduser: req.user.iduser,
    email: req.user.email,
    name: req.user.name
  };
  return res.status(201).json(user);
}

function passwordRecovery(req, res, next) {
  const user = new User();
  const payload = req.body;
  let password;
  return user.findByEmail(payload.email)
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
}

module.exports = {
  ok,
  userLogin,
  userLogout,
  userSignup,
  passwordRecovery
};
