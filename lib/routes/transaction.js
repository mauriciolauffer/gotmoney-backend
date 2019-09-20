'use strict';

const passport = require('passport');
const router = require('express').Router();
const transaction = require('./transaction_process');
const validate = require('../middleware/validate_transaction');

router.all('*', passport.isUserAuthenticated(), (req, res, next) => {
  return next();
});

router.post('/', validate.isValidCreate(), transaction.create);

router.get('/', transaction.read);

router.put('/:id', validate.isValid(), transaction.update);

router.delete('/:id', transaction.remove);

module.exports = router;
