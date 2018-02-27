'use strict';

const db = require('./../models/database');

function AccountType() {}

AccountType.prototype.getAll = function() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM accounttypes';
    const parameters = [];
    db.executePromise(sql, parameters)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

module.exports = AccountType;
