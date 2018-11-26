'use strict';

const Transaction = require('../controllers/transaction');

function create(req, res, next) {
  const transaction = new Transaction();
  const payload = req.body;
  payload.data.forEach((payloadItem) => {
    payloadItem.iduser = req.user.iduser;
  });
  return transaction.createBatch(payload.data)
    .then(() => res.status(201).json({}))
    .catch((err) => next(err));
}

function read(req, res, next) {
  const transaction = new Transaction();
  return transaction.getAll(req.user.iduser)
    .then((result) => res.status(200).json(result))
    .catch((err) => next(err));
}

function update(req, res, next) {
  const payload = req.body;
  payload.iduser = req.user.iduser;
  const transaction = new Transaction(payload);
  return transaction.update()
    .then(() => res.status(200).json({}))
    .catch((err) => next(err));
}

function remove(req, res, next) {
  const transaction = new Transaction({
    iduser: req.user.iduser,
    idtransaction: req.params.id
  });
  return transaction.delete()
    .then(() => res.status(200).json({}))
    .catch((err) => next(err));
}

module.exports = {
  create,
  read,
  update,
  remove
};
