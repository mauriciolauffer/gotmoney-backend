import { Context } from "hono";
import Account from "../controllers/account";
import { getContextData } from "../utils/route-helper";

export async function create(c: Context) {
  const { db, reqUser } = getContextData(c);
  const payload = await c.req.json();
  payload.iduser = reqUser.iduser;
  const account = new Account(db, payload);
  await account.create();
  return c.json({}, 201);
}

export async function read(c: Context) {
  const { db, reqUser } = getContextData(c);
  const account = new Account(db);
  const result = await account.getAll(reqUser.iduser);
  return c.json(result);
}

export async function update(c: Context) {
  const { db, reqUser } = getContextData(c);
  const payload = await c.req.json();
  payload.iduser = reqUser.iduser;
  const account = new Account(db, payload);
  await account.update();
  return c.json({});
}

export async function remove(c: Context) {
  const { db, reqUser } = getContextData(c);
  const id = c.req.param("id");
  const account = new Account(db, {
    iduser: reqUser.iduser,
    idaccount: id,
  });
  await account.delete();
  return c.json({});
}
