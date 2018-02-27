'use strict';

const passport = require('passport');
const router = require('express').Router();
const Transaction = require('../controllers/transaction');
const validate = require('../middleware/validate_transaction');

router.all('*', passport.isUserAuthenticated(), (req, res, next) => {
  return next();
});

router.delete('/:id', (req, res, next) => {
  const transaction = new Transaction({
    iduser: req.user.iduser,
    idtransaction: req.params.id
  });
  transaction.delete()
    .then((result) => res.status(200).json({}))
    .catch((err) => next(err));
});

router.get('/', (req, res, next) => {
  const transaction = new Transaction();
  transaction.getAll(req.user.iduser)
    .then((result) => res.status(200).json(result))
    .catch((err) => next(err));
});

router.post('/', validate.isValidCreate(), (req, res, next) => {
  const transaction = new Transaction();
  const payload = req.body;
  transaction.createBatch(req.user.iduser, payload.data)
    .then(() => res.status(201).json({}))
    .catch((err) => next(err));
});

router.put('/:id', validate.isValid(), (req, res, next) => {
  const payload = req.body;
  payload.iduser = req.user.iduser;
  const transaction = new Transaction(payload);
  transaction.update()
    .then((result) => res.status(200).json({}))
    .catch((err) => next(err));
});

module.exports = router;
