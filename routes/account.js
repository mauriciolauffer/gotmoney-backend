'use strict';

const passport = require('passport');
const router = require('express').Router();
const Account = require('../controllers/account');
const isValid = require('../middleware/validate_account');

router.all('*', passport.isUserAuthenticated(), (req, res, next) => {
  return next();
});

router.delete('/:id', (req, res, next) => {
  const account = new Account({
    iduser: req.user.iduser,
    idaccount: req.params.id
  });
  account.delete()
    .then((result) => res.status(200).json({}))
    .catch((err) => next(err));
});

router.get('/', (req, res, next) => {
  const account = new Account();
  account.getAll(req.user.iduser)
    .then((result) => res.status(200).json(result))
    .catch((err) => next(err));
});

router.post('/', isValid(), (req, res, next) => {
  const payload = req.body;
  payload.iduser = req.user.iduser;
  const account = new Account(payload);
  account.create()
    .then(() => res.status(201).json({}))
    .catch((err) => next(err));
});

router.put('/:id', isValid(), (req, res, next) => {
  const payload = req.body;
  payload.iduser = req.user.iduser;
  const account = new Account(payload);
  account.update()
    .then((result) => res.status(200).json({}))
    .catch((err) => next(err));
});

module.exports = router;
