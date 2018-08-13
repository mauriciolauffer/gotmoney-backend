'use strict';

const bcrypt = require('bcryptjs');
const md5 = require('crypto-js/md5');
const sha256 = require('crypto-js/sha256');
const base64 = require('crypto-js/enc-base64');
const db = require('../models/user');
const CustomErrors = require('../utils/errors');

function User(data = {}) {
  this.setProperties(data);
}

User.prototype.setProperties = function({iduser, name, gender, birthdate, email, createdon, passwd, alert,
                                         facebook, google, twitter}) {
  this.props = {
    iduser: iduser,
    name: name,
    gender: gender || 'F',
    birthdate: birthdate || null,
    email: email,
    createdon: createdon || null,
    passwd: passwd || null,
    alert: alert,
    active: true,
    facebook: facebook || null,
    google: google || null,
    twitter: twitter || null
  };
};

User.prototype.getProperties = function() {
  const props = Object.assign({}, this.props);
  delete props.passwd;
  return props;
};

User.prototype.findById = function(iduser) {
  return db.findOne({ iduser: iduser })
    .lean().exec()
    .then((docs) => {
      if (docs) {
        return new User(docs);
      } else {
        throw CustomErrors.HTTP.get404();
      }
    })
    .catch((err) => {
      throw err;
    });
};

User.prototype.findByEmail = function(email) {
  return db.findOne({ email: email })
    .lean().exec()
    .then((docs) => {
      if (docs) {
        return new User(docs);
      } else {
        throw CustomErrors.HTTP.get404();
      }
    })
    .catch((err) => {
      throw err;
    });
};

User.prototype.findByFacebook = function(facebook) {
  return db.findOne({ facebook: facebook })
    .lean().exec()
    .then((docs) => {
      if (docs) {
        return new User(docs);
      } else {
        throw CustomErrors.HTTP.get404();
      }
    })
    .catch((err) => {
      throw err;
    });
};

User.prototype.findByGoogle = function(google) {
  return db.findOne({ google: google })
    .lean().exec()
    .then((docs) => {
      if (docs) {
        return new User(docs);
      } else {
        throw CustomErrors.HTTP.get404();
      }
    })
    .catch((err) => {
      throw err;
    });
};

User.prototype._preHashPassword = function(password) {
  return base64.stringify(sha256(password));
};

User.prototype.hashPassword = function(password) {
  const preHashPassword = this._preHashPassword(password);
  return bcrypt.hash(preHashPassword, 10);
};

User.prototype.verifyPassword = function(password) {
  return new Promise((resolve, reject) => {
    const preHashPassword = this._preHashPassword(password);
    bcrypt.compare(preHashPassword, this.props.passwd)
      .then((result) => {
        if (result === true) {
          return resolve();
        } else {
          const err = new Error('Invalid password!');
          return reject(err);
        }
      })
      .catch((err) => reject(err));
  });
};

User.prototype.setId = function() {
  this.props.iduser = Date.now();
};

User.prototype.setAutoPassword = function() {
  this.props.passwd = md5(sha256([Math.random().toString(), new Date().toISOString()].join('gotMONEYapp'))).toString();
};

User.prototype.create = function() {
  return this.hashPassword(this.props.passwd)
    .then((hash) => {
      this.props.passwd = hash;
      this.props.active = true;
      this.props.createdon = new Date();
      return db.create(this.props);
    })
    .catch((err) => {
      throw err;
    });
};

User.prototype.update = function() {
  return db.findOneAndUpdate({ iduser: this.props.iduser }, {
    name: this.props.name,
    alert: this.props.alert
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

User.prototype.updateFacebook = function() {
  return db.findOneAndUpdate({ iduser: this.props.iduser }, { facebook: this.props.facebook })
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

User.prototype.updateGoogle = function() {
  return db.findOneAndUpdate({ iduser: this.props.iduser }, { google: this.props.google })
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

User.prototype.updatePassword = function() {
  return this.hashPassword(this.props.passwd)
    .then((hash) => {
      return db.findOneAndUpdate({ iduser: this.props.iduser }, { passwd: hash })
        .lean().exec()
        .then((docs) => {
          if (docs) {
            return docs;
          } else {
            throw CustomErrors.HTTP.get404();
          }
        });
    })
    .catch((err) => {
      throw err;
    });
};

User.prototype.delete = function() {
  return db.findOneAndDelete({ iduser: this.props.iduser })
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

module.exports = User;
