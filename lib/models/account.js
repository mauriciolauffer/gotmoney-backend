'use strict';

const mongoose = require('mongoose');
const Account = new mongoose.Schema(
  {
    idaccount: {
      type: Number
    },
    iduser: {
      type: Number
    },
    idtype: {
      type: Number
    },
    description: {
      type: String
    },
    creditlimit: {
      type: Number
    },
    balance: {
      type: Number
    },
    openingdate: {
      type: Date
    },
    duedate: {
      type: Number
    }
  },
  {
    collection: 'Accounts',
    timestamps: true
  }
);

module.exports = mongoose.model('Account', Account);
