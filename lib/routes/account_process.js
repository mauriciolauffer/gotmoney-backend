'use strict';

const Account = require('../controllers/account');

function create(req, res, next) {
  const payload = req.body;
  payload.iduser = req.user.iduser;
  const account = new Account(payload);
  return account.create()
      .then(() => res.status(201).json({}))
      .catch((err) => next(err));
}

function read(req, res, next) {
  const account = new Account();
  return account.getAll(req.user.iduser)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
}

function update(req, res, next) {
  const payload = req.body;
  payload.iduser = req.user.iduser;
  const account = new Account(payload);
  return account.update()
      .then(() => res.status(200).json({}))
      .catch((err) => next(err));
}

function remove(req, res, next) {
  const account = new Account({
    iduser: req.user.iduser,
    idaccount: req.params.id,
  });
  return account.delete()
      .then(() => res.status(200).json({}))
      .catch((err) => next(err));
}

module.exports = {
  create,
  read,
  update,
  remove,
};
