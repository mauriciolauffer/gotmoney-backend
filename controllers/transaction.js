'use strict';

const mysql = require('mysql2');
const db = require('./../models/database');

function Transaction(data = {}) {
  this.setProperties(data);
}

Transaction.prototype.setProperties = function({iduser, idtransaction, idaccount, idparent, idstatus, description,
                                                instalment, amount, type, startdate, duedate, tag, origin, lastchange}) {
  this.props = {
    iduser: iduser,
    idtransaction: idtransaction,
    idaccount: idaccount,
    idparent: idparent,
    idstatus: idstatus,
    description: description,
    instalment: instalment,
    amount: amount || 0,
    type: type,
    startdate: startdate,
    duedate: duedate,
    tag: tag,
    origin: origin,
    lastchange: lastchange
  };
};

Transaction.prototype.getProperties = function() {
  return Object.assign({}, this.props);
};

Transaction.prototype.findById = function(iduser, idtransaction) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM transactions WHERE iduser = ? AND idtransaction = ?';
    const parameters = [iduser, idtransaction];
    db.executePromise(sql, parameters)
      .then((result) => resolve(new Transaction(result[0])))
      .catch((err) => reject(err));
  });
};

Transaction.prototype.getAll = function(iduser) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM transactions WHERE iduser = ? ORDER BY duedate';
    const parameters = [iduser];
    db.executePromise(sql, parameters)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

Transaction.prototype.findByPeriod = function(iduser, year, month) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM transactions WHERE iduser = ? AND EXTRACT(YEAR_MONTH FROM duedate) = ? ORDER BY duedate';
    const parameters = [iduser, year + '' + month];
    db.executePromise(sql, parameters)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

Transaction.prototype.findOverdue = function(iduser) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM transactions WHERE iduser = ? AND duedate < ? ORDER BY duedate';
    const parameters = [iduser, new Date()];
    db.executePromise(sql, parameters)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

Transaction.prototype.create = function() {
  return new Promise((resolve, reject) => {
    const fields = 'iduser, idtransaction, idaccount, idparent, idstatus, description, instalment, amount, type, ' +
      'startdate, duedate, tag, origin';
    const sql = 'INSERT INTO transactions (' + fields + ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const parameters = [this.props.iduser, this.props.idtransaction, this.props.idaccount, this.props.idparent,
                        this.props.idstatus, this.props.description, this.props.instalment, this.props.amount,
                        this.props.type, this.props.startdate, this.props.duedate, this.props.tag, this.props.origin];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

Transaction.prototype.createBatch = function(iduser, payload) {
  return new Promise((resolve, reject) => {
    const fields = 'iduser, idtransaction, idaccount, idparent, idstatus, description, instalment, amount, type, ' +
      'startdate, duedate, tag, origin';
    const sql = 'INSERT INTO transactions (' + fields + ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const sqlBulk = [];
    payload.forEach((item) => {
      const parameters = [iduser, item.idtransaction, item.idaccount, item.idparent,
                          item.idstatus, item.description, item.instalment, item.amount, item.type,
                          item.startdate, item.duedate, item.tag, item.origin];
      sqlBulk.push(mysql.format(sql, parameters));
    });
    const sqlFinal = sqlBulk.join('; ');
    db.queryPromise(sqlFinal)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

Transaction.prototype.update = function() {
  return new Promise((resolve, reject) => {
    const fields = 'idaccount = ?, idstatus = ?, description = ?, instalment = ?, amount = ?, type = ?, ' +
      'startdate = ?, duedate = ?, tag = ?, origin = ?';
    const sql = 'UPDATE transactions SET ' + fields + ' WHERE iduser = ? AND idtransaction = ?';
    const parameters = [this.props.idaccount, this.props.idstatus, this.props.description, this.props.instalment,
                        this.props.amount, this.props.type, this.props.startdate, this.props.duedate,
                        this.props.tag, this.props.origin, this.props.iduser, this.props.idtransaction];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

Transaction.prototype.delete = function() {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM transactions WHERE iduser = ? AND idtransaction = ?';
    const parameters = [this.props.iduser, this.props.idtransaction];
    db.executePromise(sql, parameters)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};

module.exports = Transaction;
