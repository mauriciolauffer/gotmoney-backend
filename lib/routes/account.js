'use strict';

const passport = require('passport');
const router = require('express').Router();
const account = require('./account_process');
const isValid = require('../middleware/validate_account');

router.all('*', passport.isUserAuthenticated(), (req, res, next) => {
  return next();
});

router.post('/', isValid(), account.create);

router.get('/', account.read);

router.put('/:id', isValid(), account.update);

router.delete('/:id', account.remove);

module.exports = router;
