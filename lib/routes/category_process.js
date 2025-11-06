'use strict';

import Category from '../controllers/category.js';

export async function create(c) {
  const user = c.get('user');
  const payload = await c.req.json();
  payload.iduser = user.iduser;
  const category = new Category(payload);
  try {
    const newCategory = await category.create();
    return c.json(newCategory, 201);
  } catch (err) {
    return c.json(err, 500);
  }
}

export async function readAll(c) {
  const user = c.get('user');
  const category = new Category();
  try {
    const categories = await category.getAll(user.iduser);
    return c.json(categories);
  } catch (err) {
    return c.json(err, 500);
  }
}

export async function read(c) {
  const user = c.get('user');
  const id = c.req.param('id');
  const category = new Category();
  try {
    const result = await category.findById(user.iduser, id);
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
  payload.idcategory = id;
  const category = new Category(payload);
  try {
    await category.update();
    return c.json({}, 200);
  } catch (err) {
    return c.json(err, 500);
  }
}

export async function remove(c) {
  const user = c.get('user');
  const id = c.req.param('id');
  const category = new Category({ iduser: user.iduser, idcategory: id });
  try {
    await category.delete();
    return c.json({}, 200);
  } catch (err) {
    return c.json(err, 500);
  }
}
