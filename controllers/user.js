'use strict';

const bcrypt = require('bcryptjs');
const md5 = require('crypto-js/md5');
const sha256 = require('crypto-js/sha256');
const base64 = require('crypto-js/enc-base64');
const db = require('./../models/database');

function User(data = {}) {
  this.setProperties(data);
}

User.prototype.setProperties = function({iduser, name, gender, birthdate, email, createdon, passwd, alert, facebook,
                                         google, twitter, lastchange}) {
  this.props = {
    iduser: iduser,
    name: name,
    gender: gender || 'F',
    birthdate: birthdate || null,
    email: email,
    createdon: createdon || null,
    passwd: passwd || null,
    alert: (alert) ? 1 : 0,
    facebook: facebook || null,
    google: google || null,
    twitter: twitter || null,
    lastchange: lastchange || null
  };
};

User.prototype.getProperties = function() {
  const props = Object.assign({}, this.props);
  delete props.passwd;
  return props;
};

User.prototype.findById = function(iduser) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE iduser = ?';
    const parameters = [iduser];
    db.executePromise(sql, parameters)
      .then((result) => {
        if (result.length === 0) {
          const err = new Error('Not Found!');
          err.status = 404;
          return reject(err);
        }
        return resolve(new User(result[0]));
      })
      .catch((err) => reject(err));
  });
};

User.prototype.findByEmail = function(email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const parameters = [email];
    db.executePromise(sql, parameters)
      .then((result) => {
        if (result.length === 0) {
          const err = new Error('Not Found!');
          err.status = 404;
          return reject(err);
        }
        return resolve(new User(result[0]));
      })
      .catch((err) => reject(err));
  });
};

User.prototype.findByFacebook = function(facebook) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE facebook = ?';
    const parameters = [facebook];
    db.executePromise(sql, parameters)
      .then((result) => {
        if (result.length === 0) {
          const err = new Error('Not Found!');
          err.status = 404;
          return reject(err);
        }
        return resolve(new User(result[0]));
      })
      .catch((err) => reject(err));
  });
};

User.prototype.findByGoogle = function(google) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE google = ?';
    const parameters = [google];
    db.executePromise(sql, parameters)
      .then((result) => {
        if (result.length === 0) {
          const err = new Error('Not Found!');
          err.status = 404;
          return reject(err);
        }
        return resolve(new User(result[0]));
      })
      .catch((err) => reject(err));
  });
};

User.prototype._preHashPassword = function(password) {
  return base64.stringify(sha256(password));
};

User.prototype.hashPassword = function(password) {
  const preHashPassword = this._preHashPassword(password);
  return bcrypt.hash(preHashPassword, 10);
};

User.prototype.verifyPassword = function(password) {
  return new Promise((resolve, reject) => {
    const preHashPassword = this._preHashPassword(password);
    bcrypt.compare(preHashPassword, this.props.passwd)
      .then((result) => {
        if (result === true) {
          return resolve();
        }
        const err = new Error('Invalid password!');
        return reject(err);
      })
      .catch((err) => reject(err));
  });
};

User.prototype.setId = function() {
  this.props.iduser = new Date().getTime();
};

User.prototype.setAutoPassword = function() {
  this.props.passwd = md5(sha256([Math.random().toString(), new Date().toISOString()].join('gotMONEYapp'))).toString();
};

User.prototype.create = function() {
  return new Promise((resolve, reject) => {
    this.hashPassword(this.props.passwd)
      .then((hash) => {
        this.props.passwd = hash;
        this.props.active = 1;
        this.props.createdon = new Date();
        const fields = 'iduser, name, gender, birthdate, email, createdon, passwd, active, alert, facebook, google, twitter';
        const sql = 'INSERT INTO users (' + fields + ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const parameters = [this.props.iduser, this.props.name, this.props.gender, this.props.birthdate,
                            this.props.email, this.props.createdon, this.props.passwd, this.props.active,
                            this.props.alert, this.props.facebook, this.props.google, this.props.twitter];
        return db.executePromise(sql, parameters);
      })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

User.prototype.update = function() {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET name = ?, gender = ?, birthdate = ?, alert = ? WHERE iduser = ?';
    const parameters = [this.props.name, this.props.gender, this.props.birthdate, this.props.alert, this.props.iduser];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));

  });
};

User.prototype.updateFacebook = function() {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET facebook = ? WHERE iduser = ?';
    const parameters = [this.props.facebook, this.props.iduser];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

User.prototype.updateGoogle = function() {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET google = ? WHERE iduser = ?';
    const parameters = [this.props.google, this.props.iduser];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

User.prototype.updatePassword = function() {
  return new Promise((resolve, reject) => {
    this.hashPassword(this.props.passwd)
      .then((hash) => {
        this.props.passwd = hash;
        const sql = 'UPDATE users SET passwd = ? WHERE iduser = ?';
        const parameters = [hash, this.props.iduser];
        return db.executePromise(sql, parameters);
      })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

User.prototype.delete = function() {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM users WHERE iduser = ?';
    const parameters = [this.props.iduser];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

module.exports = User;
