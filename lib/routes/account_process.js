'use strict';

import Account from '../controllers/account.js';

export async function create(c) {
  const user = c.get('user');
  const payload = await c.req.json();
  payload.iduser = user.iduser;
  const account = new Account(payload);
  try {
    const newAccount = await account.create();
    return c.json(newAccount, 201);
  } catch (err) {
    return c.json(err, 500);
  }
}

export async function readAll(c) {
  const user = c.get('user');
  const account = new Account();
  try {
    const accounts = await account.getAll(user.iduser);
    return c.json(accounts);
  } catch (err) {
    return c.json(err, 500);
  }
}

export async function read(c) {
  const user = c.get('user');
  const id = c.req.param('id');
  const account = new Account();
  try {
    const result = await account.findById(user.iduser, id);
    return c.json(result.getProperties());
  } catch (err) {
    return c.json(err, 500);
  }
}

export async function update(c) {
  const user = c.get('user');
  const id = c.req.param('id');
  const payload = await c.req.json();
  payload.iduser = user.iduser;
  payload.idaccount = id;
  const account = new Account(payload);
  try {
    await account.update();
    return c.json({}, 200);
  } catch (err) {
    return c.json(err, 500);
  }
}

export async function remove(c) {
  const user = c.get('user');
  const id = c.req.param('id');
  const account = new Account({ iduser: user.iduser, idaccount: id });
  try {
    await account.delete();
    return c.json({}, 200);
  } catch (err) {
    return c.json(err, 500);
  }
}
