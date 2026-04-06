import { Context } from 'hono';
import Account from '../controllers/account';

export async function create(c: Context) {
  const payload = await c.req.json();
  const reqUser = c.get('jwtPayload') || (c.get('user') as any);
  payload.iduser = reqUser.iduser;
  const account = new Account(payload);
  await account.create();
  return c.json({}, 201);
}

export async function read(c: Context) {
  const account = new Account();
  const reqUser = c.get('jwtPayload') || (c.get('user') as any);
  const result = await account.getAll(reqUser.iduser);
  return c.json(result);
}

export async function update(c: Context) {
  const payload = await c.req.json();
  const reqUser = c.get('jwtPayload') || (c.get('user') as any);
  payload.iduser = reqUser.iduser;
  const account = new Account(payload);
  await account.update();
  return c.json({});
}

export async function remove(c: Context) {
  const id = c.req.param('id');
  const reqUser = c.get('jwtPayload') || (c.get('user') as any);
  const account = new Account({
    iduser: reqUser.iduser,
    idaccount: id,
  });
  await account.delete();
  return c.json({});
}
