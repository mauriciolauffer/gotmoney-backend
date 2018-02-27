'use strict';

const db = require('./../models/database');

function Account(data = {}) {
  this.setProperties(data);
}

Account.prototype.setProperties = function({iduser, idaccount, idtype, description, creditlimit, balance, openingdate, duedate, lastchange}) {
  this.props = {
    iduser: iduser,
    idaccount: idaccount,
    idtype: idtype,
    description: description,
    creditlimit: creditlimit || 0,
    balance: balance || 0,
    openingdate: openingdate,
    duedate: duedate,
    lastchange: lastchange
  };
};

Account.prototype.getProperties = function() {
  return Object.assign({}, this.props);
};

Account.prototype.findById = function(iduser, idaccount) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM accounts WHERE idaccount = ? AND iduser = ?';
    const parameters = [idaccount, iduser];
    db.executePromise(sql, parameters)
      .then((result) => resolve(new Account(result[0])))
      .catch((err) => reject(err));
  });
};

Account.prototype.getAll = function(iduser) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM accounts WHERE iduser = ? ORDER BY description';
    const parameters = [iduser];
    db.executePromise(sql, parameters)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

Account.prototype.create = function() {
  return new Promise((resolve, reject) => {
    const fields = 'idaccount, iduser, idtype, description, creditlimit, balance, openingdate, duedate';
    const sql = 'INSERT INTO accounts (' + fields + ') VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const parameters = [this.props.idaccount, this.props.iduser, this.props.idtype, this.props.description,
                        this.props.creditlimit, this.props.balance, this.props.openingdate, this.props.duedate];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

Account.prototype.update = function() {
  return new Promise((resolve, reject) => {
    const fields = 'idtype= ?, description = ?, creditlimit = ?, balance = ?, openingdate = ?, duedate = ?';
    const sql = 'UPDATE accounts SET ' + fields + ' WHERE idaccount = ? AND iduser = ?';
    const parameters = [this.props.idtype, this.props.description, this.props.creditlimit, this.props.balance,
                        this.props.openingdate, this.props.duedate, this.props.idaccount, this.props.iduser];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

Account.prototype.delete = function() {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM accounts WHERE idaccount = ? AND iduser = ?';
    const parameters = [this.props.idaccount, this.props.iduser];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

module.exports = Account;
