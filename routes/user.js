'use strict';

const passport = require('passport');
const router = require('express').Router();
const user = require('./user_process');
const validator = require('../middleware/validate_user');

router.all('*', passport.isUserAuthenticated(), (req, res, next) => {
  return next();
});

router.get('/:id', user.read);

router.put('/:id', validator.isValidUpdate(), user.update);

module.exports = router;
