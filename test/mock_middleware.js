'user strict';

const app = require('../app');

function getMiddleware(name) {
  return app._router.stack.filter((item) => item.name === name)[0];
}

function authenticate(req, res, next) {
  req.user = {iduser: 1};
  req.isAuthenticated = () => true;
  next();
}

module.exports = {
  getMiddleware,
  authenticate
};
