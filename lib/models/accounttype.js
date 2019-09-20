'use strict';

const mongoose = require('mongoose');
const AccountType = new mongoose.Schema(
  {
    idtype: {
      type: Number
    },
    description: {
      type: String
    },
    icon: {
      type: String
    },
    inactive: {
      type: Boolean
    }
  },
  {
    collection: 'AccountTypes'
  }
);

module.exports = mongoose.model('AccountType', AccountType);
