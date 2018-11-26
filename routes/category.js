'use strict';

const passport = require('passport');
const router = require('express').Router();
const category = require('./category_process');
const isValid = require('../middleware/validate_category');

router.all('*', passport.isUserAuthenticated(), (req, res, next) => {
  return next();
});

router.post('/', isValid(), category.create);

router.get('/', category.read);

router.put('/:id', isValid(), category.update);

router.delete('/:id', category.remove);

module.exports = router;
