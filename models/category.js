'use strict';

const mongoose = require('mongoose');
const Category = new mongoose.Schema(
  {
    idcategory: {
      type: Number
    },
    iduser: {
      type: Number
    },
    description: {
      type: String
    }
  },
  {
    collection: 'Categories',
    timestamps: true
  }
);

module.exports = mongoose.model('Category', Category);
