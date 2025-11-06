'use strict';

import Transaction from '../controllers/transaction.js';

export async function create(c) {
  const user = c.get('user');
  const payload = await c.req.json();
  payload.iduser = user.iduser;
  const transaction = new Transaction(payload);
  try {
    const newTransaction = await transaction.create();
    return c.json(newTransaction, 201);
  } catch (err) {
    return c.json(err, 500);
  }
}

export async function readAll(c) {
  const user = c.get('user');
  const transaction = new Transaction();
  try {
    const transactions = await transaction.getAll(user.iduser);
    return c.json(transactions);
  } catch (err) {
    return c.json(err, 500);
  }
}

export async function readOverdue(c) {
    const user = c.get('user');
    const transaction = new Transaction();
    try {
      const transactions = await transaction.findOverdue(user.iduser);
      return c.json(transactions);
    } catch (err) {
      return c.json(err, 500);
    }
}

export async function readByPeriod(c) {
    const user = c.get('user');
    const year = c.req.param('year');
    const month = c.req.param('month');
    const transaction = new Transaction();
    try {
      const transactions = await transaction.findByPeriod(user.iduser, year, month);
      return c.json(transactions);
    } catch (err) {
      return c.json(err, 500);
    }
}

export async function read(c) {
  const user = c.get('user');
  const id = c.req.param('id');
  const transaction = new Transaction();
  try {
    const result = await transaction.findById(user.iduser, id);
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
  payload.idtransaction = id;
  const transaction = new Transaction(payload);
  try {
    await transaction.update();
    return c.json({}, 200);
  } catch (err) {
    return c.json(err, 500);
  }
}

export async function remove(c) {
  const user = c.get('user');
  const id = c.req.param('id');
  const transaction = new Transaction({ iduser: user.iduser, idtransaction: id });
  try {
    await transaction.delete();
    return c.json({}, 200);
  } catch (err) {
    return c.json(err, 500);
  }
}
