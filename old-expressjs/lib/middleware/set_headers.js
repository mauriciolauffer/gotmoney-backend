'use strict';

function setCsrfToken(req, res, next) {
  res.set('x-csrf-token', req.csrfToken());
  next();
}

module.exports = {setCsrfToken};
