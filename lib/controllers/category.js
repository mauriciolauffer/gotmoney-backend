'use strict';

const db = require('../models/category');
const CustomErrors = require('../utils/errors');

function Category(data = {}) {
  this.setProperties(data);
}

Category.prototype.setProperties = function({idcategory, iduser, description, budget}) {
  this.props = {
    idcategory,
    iduser,
    description,
    budget: budget || 0,
  };
};

Category.prototype.getProperties = function() {
  return Object.assign({}, this.props);
};

Category.prototype.findById = function(iduser, idcategory) {
  return db.findOne({
    iduser: iduser,
    idcategory: idcategory,
  })
      .lean().exec()
      .then((docs) => {
        if (docs) {
          return new Category(docs[0]);
        } else {
          throw CustomErrors.HTTP.get404();
        }
      })
      .catch((err) => {
        throw err;
      });
};

Category.prototype.getAll = function(iduser) {
  return db.find({iduser: iduser})
      .sort({description: 1})
      .lean().exec()
      .then((docs) => {
        return (docs) ? docs : [];
      })
      .catch((err) => {
        throw err;
      });
};

Category.prototype.create = function() {
  return db.create(this.props)
      .then((docs) => docs)
      .catch((err) => {
        throw err;
      });
};

Category.prototype.update = function() {
  return db.findOneAndUpdate({
    iduser: this.props.iduser,
    idcategory: this.props.idcategory,
  }, {
    description: this.props.description,
    budget: this.props.budget,
  })
      .lean().exec()
      .then((docs) => {
        if (docs) {
          return docs;
        } else {
          throw CustomErrors.HTTP.get404();
        }
      })
      .catch((err) => {
        throw err;
      });
};

Category.prototype.delete = function() {
  return db.findOneAndDelete({
    iduser: this.props.iduser,
    idcategory: this.props.idcategory,
  })
      .lean().exec()
      .then((docs) => {
        if (docs) {
          return docs;
        } else {
          throw CustomErrors.HTTP.get404();
        }
      })
      .catch((err) => {
        throw err;
      });
};

module.exports = Category;
