'use strict';

const Category = require('../controllers/category');

function create(req, res, next) {
  const payload = req.body;
  payload.iduser = req.user.iduser;
  const category = new Category(payload);
  return category.create()
      .then(() => res.status(201).json({}))
      .catch((err) => next(err));
}

function read(req, res, next) {
  const category = new Category();
  return category.getAll(req.user.iduser)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
}

function update(req, res, next) {
  const payload = req.body;
  payload.iduser = req.user.iduser;
  const category = new Category(payload);
  return category.update()
      .then(() => res.status(200).json({}))
      .catch((err) => next(err));
}

function remove(req, res, next) {
  const category = new Category({
    iduser: req.user.iduser,
    idcategory: req.params.id,
  });
  return category.delete()
      .then(() => res.status(200).json({}))
      .catch((err) => next(err));
}

module.exports = {
  create,
  read,
  update,
  remove,
};
