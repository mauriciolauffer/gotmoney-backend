import { Context } from "hono";
import Transaction from "../controllers/transaction";

export async function create(c: Context) {
  const db = c.env.DB;
  const transaction = new Transaction(db);
  const payload = await c.req.json();
  const reqUser = c.get("jwtPayload") || (c.get("user") as any);
  payload.data.forEach((payloadItem: any) => {
    payloadItem.iduser = reqUser.iduser;
  });
  await transaction.createBatch(payload.data);
  return c.json({}, 201);
}

export async function read(c: Context) {
  const db = c.env.DB;
  const transaction = new Transaction(db);
  const reqUser = c.get("jwtPayload") || (c.get("user") as any);
  const result = await transaction.getAll(reqUser.iduser);
  return c.json(result);
}

export async function update(c: Context) {
  const db = c.env.DB;
  const payload = await c.req.json();
  const reqUser = c.get("jwtPayload") || (c.get("user") as any);
  payload.iduser = reqUser.iduser;
  const transaction = new Transaction(db, payload);
  await transaction.update();
  return c.json({});
}

export async function remove(c: Context) {
  const db = c.env.DB;
  const id = c.req.param("id");
  const reqUser = c.get("jwtPayload") || (c.get("user") as any);
  const transaction = new Transaction(db, {
    iduser: reqUser.iduser,
    idtransaction: id,
  });
  await transaction.delete();
  return c.json({});
}
