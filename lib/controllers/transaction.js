'use strict';

const db = require('../models/transaction');
const CustomErrors = require('../utils/errors');

function Transaction(data = {}) {
  this.setProperties(data);
}

Transaction.prototype.setProperties = function({iduser, idtransaction, idaccount, idparent, idstatus, description,
                                                instalment, amount, type, startdate, duedate, tag, origin}) {
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
    origin: origin
  };
};

Transaction.prototype.getProperties = function() {
  return Object.assign({}, this.props);
};

Transaction.prototype.findById = function(iduser, idtransaction) {
  return db.findOne({
    iduser: iduser,
    idtransaction: idtransaction
  })
    .lean().exec()
    .then((docs) => {
      if (docs) {
        return new Transaction(docs[0]);
      } else {
        throw CustomErrors.HTTP.get404();
      }
    })
    .catch((err) => {
      throw err;
    });
};

Transaction.prototype.getAll = function(iduser) {
  return db.find({ iduser: iduser })
    .sort({ duedate: 1 })
    .lean().exec()
    .then((docs) => {
      return (docs) ? docs : [];
    })
    .catch((err) => {
      throw err;
    });
};

Transaction.prototype.findByPeriod = function(iduser, year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
  return db.find({
    iduser: iduser,
    duedate: { $gt: firstDay, $lt: lastDay }
  })
    .sort({ duedate: 1 })
    .lean().exec()
    .then((docs) => {
      return (docs) ? docs : [];
    })
    .catch((err) => {
      throw err;
    });
};

Transaction.prototype.findOverdue = function(iduser) {
  return db.find({
    iduser: iduser,
    duedate: { $lt: new Date() }
  })
    .sort({ duedate: 1 })
    .lean().exec()
    .then((docs) => {
      return (docs) ? docs : [];
    })
    .catch((err) => {
      throw err;
    });
};

Transaction.prototype.create = function() {
  return db.create(this.props)
    .then((docs) => docs)
    .catch((err) => {
      throw err;
    });
};

Transaction.prototype.createBatch = function(payload) {
  return db.insertMany(payload)
    .then((docs) => docs)
    .catch((err) => {
      throw err;
    });
};

Transaction.prototype.update = function() {
  return db.findOneAndUpdate({
    iduser: this.props.iduser,
    idtransaction: this.props.idtransaction
  }, {
    idaccount: this.props.idaccount,
    idstatus: this.props.idstatus,
    description: this.props.description,
    instalment: this.props.instalment,
    amount: this.props.amount,
    type: this.props.type,
    startdate: this.props.startdate,
    duedate: this.props.duedate,
    tag: this.props.tag,
    origin: this.props.origin
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

Transaction.prototype.delete = function() {
  return db.findOneAndDelete({
    iduser: this.props.iduser,
    idtransaction: this.props.idtransaction
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

module.exports = Transaction;
