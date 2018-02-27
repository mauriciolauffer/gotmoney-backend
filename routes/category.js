'use strict';

const passport = require('passport');
const router = require('express').Router();
const Category = require('../controllers/category');
const isValid = require('../middleware/validate_category');

router.all('*', passport.isUserAuthenticated(), (req, res, next) => {
  return next();
});

router.delete('/:id', (req, res, next) => {
  const category = new Category({
    iduser: req.user.iduser,
    idcategory: req.params.id
  });
  category.delete()
    .then((result) => res.status(200).json({}))
    .catch((err) => next(err));
});

router.get('/', (req, res, next) => {
  const category = new Category();
  category.getAll(req.user.iduser)
    .then((result) => res.status(200).json(result))
    .catch((err) => next(err));
});

router.post('/', isValid(), (req, res, next) => {
  const payload = req.body;
  payload.iduser = req.user.iduser;
  const category = new Category(payload);
  category.create()
    .then(() => res.status(201).json({}))
    .catch((err) => next(err));
});

router.put('/:id', isValid(), (req, res, next) => {
  const payload = req.body;
  payload.iduser = req.user.iduser;
  const category = new Category(payload);
  category.update()
    .then((result) => res.status(200).json({}))
    .catch((err) => next(err));
});

module.exports = router;
