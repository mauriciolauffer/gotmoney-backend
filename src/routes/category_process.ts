import { Context } from "hono";
import Category from "../controllers/category";
import { getContextData } from "../utils/route-helper";

export async function create(c: Context) {
  const { db, reqUser } = getContextData(c);
  const payload = await c.req.json();
  payload.iduser = reqUser.iduser;
  const category = new Category(db, payload);
  await category.create();
  return c.json({}, 201);
}

export async function read(c: Context) {
  const { db, reqUser } = getContextData(c);
  const category = new Category(db);
  const result = await category.getAll(reqUser.iduser);
  return c.json(result);
}

export async function update(c: Context) {
  const { db, reqUser } = getContextData(c);
  const payload = await c.req.json();
  payload.iduser = reqUser.iduser;
  const category = new Category(db, payload);
  await category.update();
  return c.json({});
}

export async function remove(c: Context) {
  const { db, reqUser } = getContextData(c);
  const id = c.req.param("id");
  const category = new Category(db, {
    iduser: reqUser.iduser,
    idcategory: id,
  });
  await category.delete();
  return c.json({});
}
