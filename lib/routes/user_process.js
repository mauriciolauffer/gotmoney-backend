'use strict';

const Account = require('../controllers/account');
const AccountType = require('../controllers/accounttype');
const Category = require('../controllers/category');
const User = require('../controllers/user');

function read(req, res, next) {
  const account = new Account();
  const accountType = new AccountType();
  const category = new Category();
  const user = new User();
  return Promise.all([user.findById(req.user.iduser), account.getAll(req.user.iduser),
                      category.getAll(req.user.iduser), accountType.getAll()])
    .then((result) => {
      const userResult = result[0].getProperties();
      userResult.Account = result[1];
      userResult.Category = result[2];
      userResult.Transaction = [];
      res.status(200).json({
        User: userResult,
        AccountType: result[3]
      });
    })
    .catch((err) => next(err));
}

function update(req, res, next) {
  const payload = req.body;
  payload.iduser = req.user.iduser;
  const user = new User(payload);
  return user.update()
    .then(() => { return (payload.passwdold && payload.passwd) ? user.findByEmail(payload.email) : false; })
    .then((userFound) => { return (userFound) ? userFound.verifyPassword(payload.passwdold) : true; })
    .then((doNotUpdatePassword) => { return (doNotUpdatePassword) ? true : user.updatePassword(); })
    .then(() => res.status(200).json({}))
    .catch((err) => next(err));
}

module.exports = {
  read,
  update
};
