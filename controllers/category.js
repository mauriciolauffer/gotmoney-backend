'use strict';

const db = require('./../models/database');

function Category(data = {}) {
  this.setProperties(data);
}

Category.prototype.setProperties = function({idcategory, iduser, description, lastchange}) {
  this.props = {
    idcategory: idcategory,
    iduser: iduser,
    description: description,
    lastchange: lastchange
  };
};

Category.prototype.getProperties = function() {
  return Object.assign({}, this.props);
};

Category.prototype.findById = function(iduser, idcategory) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM categories WHERE idcategory = ? AND iduser = ?';
    const parameters = [idcategory, iduser];
    db.executePromise(sql, parameters)
      .then((result) => resolve(new Category(result[0])))
      .catch((err) => reject(err));
  });
};

Category.prototype.getAll = function(iduser) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM categories WHERE iduser = ? ORDER BY description';
    const parameters = [iduser];
    db.executePromise(sql, parameters)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

Category.prototype.create = function() {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO categories (idcategory, iduser, description) VALUES (?, ?, ?)';
    const parameters = [this.props.idcategory, this.props.iduser, this.props.description];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

Category.prototype.update = function() {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE categories SET description = ? WHERE idcategory = ? AND iduser = ?';
    const parameters = [this.props.description, this.props.idcategory, this.props.iduser];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

Category.prototype.delete = function() {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM categories WHERE idcategory = ? AND iduser = ?';
    const parameters = [this.props.idcategory, this.props.iduser];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

module.exports = Category;
