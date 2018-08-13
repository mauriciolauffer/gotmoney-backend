'use strict';

const db = require('../models/account');
const CustomErrors = require('../utils/errors');

function Account(data = {}) {
  this.setProperties(data);
}

Account.prototype.setProperties = function({iduser, idaccount, idtype, description, creditlimit, balance,
                                            openingdate, duedate}) {
  this.props = {
    iduser: iduser,
    idaccount: idaccount,
    idtype: idtype,
    description: description,
    creditlimit: creditlimit || 0,
    balance: balance || 0,
    openingdate: openingdate,
    duedate: duedate
  };
};

Account.prototype.getProperties = function() {
  return Object.assign({}, this.props);
};

Account.prototype.findById = function(iduser, idaccount) {
  return db.findOne({
    iduser: iduser,
    idaccount: idaccount
  })
    .lean().exec()
    .then((docs) => {
      if (docs) {
        return new Account(docs[0]);
      } else {
        throw CustomErrors.HTTP.get404();
      }
    })
    .catch((err) => {
      throw err;
    });
};

Account.prototype.getAll = function(iduser) {
  return db.find({ iduser: iduser })
    .sort({ description: 1 })
    .lean().exec()
    .then((docs) => {
      return (docs) ? docs : [];
    })
    .catch((err) => {
      throw err;
    });
};

Account.prototype.create = function() {
  return db.create(this.props)
    .then((docs) => docs)
    .catch((err) => {
      throw err;
    });
};

Account.prototype.update = function() {
  return db.findOneAndUpdate({
    iduser: this.props.iduser,
    idaccount: this.props.idaccount
  }, {
    idtype: this.props.idtype,
    description: this.props.description,
    creditlimit: this.props.creditlimit,
    balance: this.props.balance,
    openingdate: this.props.openingdate,
    duedate: this.props.duedate
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

Account.prototype.delete = function() {
  return db.findOneAndDelete({
    iduser: this.props.iduser,
    idaccount: this.props.idaccount
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

module.exports = Account;
