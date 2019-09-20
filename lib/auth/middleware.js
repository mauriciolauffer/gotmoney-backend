'use strict';

function isUserAuthenticated() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401).json(new Error('User not logged in!'));
    }
  };
}

module.exports = isUserAuthenticated;
