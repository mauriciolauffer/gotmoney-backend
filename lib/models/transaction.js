'use strict';

const mongoose = require('mongoose');
const Transaction = new mongoose.Schema(
  {
    iduser: {
      type: Number
    },
    idtransaction: {
      type: Number
    },
    idaccount: {
      type: Number
    },
    idparent: {
      type: Number
    },
    idstatus: {
      type: Number
    },
    description: {
      type: String
    },
    instalment: {
      type: String
    },
    amount: {
      type: Number
    },
    type: {
      type: String
    },
    startdate: {
      type: Date
    },
    duedate: {
      type: Date
    },
    tag: {
      type: String
    },
    origin: {
      type: String
    }
  },
  {
    collection: 'Transactions',
    timestamps: true
  }
);

module.exports = mongoose.model('Transaction', Transaction);
