'use strict';

const app = require('../../app');
const Helper = require('./helper');

function getMiddleware(name) {
  return app._router.stack.filter((item) => item.name === name)[0];
}

function authenticate(req, res, next) {
  req.user = { iduser: Helper.getFakeUser().iduser };
  req.isAuthenticated = () => true;
  next();
}

module.exports = {
  getMiddleware,
  authenticate
};
