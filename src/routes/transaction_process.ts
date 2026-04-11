import { Context } from "hono";
import Transaction from "../controllers/transaction";
import { getContextData } from "../utils/route-helper";

export async function create(c: Context) {
  const { db, reqUser } = getContextData(c);
  const transaction = new Transaction(db);
  const payload = await c.req.json();
  payload.data.forEach((payloadItem: any) => {
    payloadItem.iduser = reqUser.iduser;
  });
  await transaction.createBatch(payload.data);
  return c.json({}, 201);
}

export async function read(c: Context) {
  const { db, reqUser } = getContextData(c);
  const transaction = new Transaction(db);
  const result = await transaction.getAll(reqUser.iduser);
  return c.json(result);
}

export async function update(c: Context) {
  const { db, reqUser } = getContextData(c);
  const payload = await c.req.json();
  payload.iduser = reqUser.iduser;
  const transaction = new Transaction(db, payload);
  await transaction.update();
  return c.json({});
}

export async function remove(c: Context) {
  const { db, reqUser } = getContextData(c);
  const id = c.req.param("id");
  const transaction = new Transaction(db, {
    iduser: reqUser.iduser,
    idtransaction: id,
  });
  await transaction.delete();
  return c.json({});
}
