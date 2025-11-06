'use strict';

import Account from '../controllers/account.js';
import AccountType from '../controllers/accounttype.js';
import Category from '../controllers/category.js';
import User from '../controllers/user.js';

export async function read(c) {
  const userFromContext = c.get('user');
  const account = new Account();
  const accountType = new AccountType();
  const category = new Category();
  const user = new User();
  try {
    const [userResult, accounts, categories, accountTypes] = await Promise.all([
      user.findById(userFromContext.iduser),
      account.getAll(userFromContext.iduser),
      category.getAll(userFromContext.iduser),
      accountType.getAll()
    ]);
    const userProperties = userResult.getProperties();
    userProperties.Account = accounts;
    userProperties.Category = categories;
    userProperties.Transaction = [];
    return c.json({
      User: userProperties,
      AccountType: accountTypes,
    });
  } catch (err) {
    return c.json(err, 500);
  }
}

export async function update(c) {
  const userFromContext = c.get('user');
  const payload = await c.req.json();
  payload.iduser = userFromContext.iduser;
  const user = new User(payload);
  try {
    await user.update();
    if (payload.passwdold && payload.passwd) {
      const userFound = await user.findByEmail(payload.email);
      await userFound.verifyPassword(payload.passwdold);
      await user.updatePassword();
    }
    return c.json({}, 200);
  } catch (err) {
    return c.json(err, 500);
  }
}
