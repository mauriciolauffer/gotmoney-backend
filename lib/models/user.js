'use strict';

const mongoose = require('mongoose');
const user = new mongoose.Schema(
    {
      iduser: {
        type: Number,
      },
      email: {
        type: String,
      },
      name: {
        type: String,
      },
      passwd: {
        type: String,
      },
      alert: {
        type: Boolean,
      },
      active: {
        type: Boolean,
      },
      facebook: {
        type: String,
      },
      google: {
        type: String,
      },
      twitter: {
        type: String,
      },
      createdon: {
        type: Date,
      },
    },
    {
      collection: 'Users',
      timestamps: true,
    }
);

module.exports = mongoose.model('User', user);
