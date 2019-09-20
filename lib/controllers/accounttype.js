'use strict';

const db = require('../models/accounttype');

function AccountType() {}

AccountType.prototype.getAll = function() {
  return db.find({})
      .lean().exec()
      .then((docs) => docs)
      .catch((err) => {
        err.status = 404;
        err.code = 'NOT_FOUND';
        throw err;
      });
};

module.exports = AccountType;
