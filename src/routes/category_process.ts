import { Context } from "hono";
import Category from "../controllers/category";

export async function create(c: Context) {
  const db = c.env.DB;
  const payload = await c.req.json();
  const reqUser = c.get("jwtPayload") || (c.get("user") as any);
  payload.iduser = reqUser.iduser;
  const category = new Category(db, payload);
  await category.create();
  return c.json({}, 201);
}

export async function read(c: Context) {
  const db = c.env.DB;
  const category = new Category(db);
  const reqUser = c.get("jwtPayload") || (c.get("user") as any);
  const result = await category.getAll(reqUser.iduser);
  return c.json(result);
}

export async function update(c: Context) {
  const db = c.env.DB;
  const payload = await c.req.json();
  const reqUser = c.get("jwtPayload") || (c.get("user") as any);
  payload.iduser = reqUser.iduser;
  const category = new Category(db, payload);
  await category.update();
  return c.json({});
}

export async function remove(c: Context) {
  const db = c.env.DB;
  const id = c.req.param("id");
  const reqUser = c.get("jwtPayload") || (c.get("user") as any);
  const category = new Category(db, {
    iduser: reqUser.iduser,
    idcategory: id,
  });
  await category.delete();
  return c.json({});
}
