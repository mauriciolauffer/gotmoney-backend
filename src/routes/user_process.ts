import { Context } from "hono";
import Account from "../controllers/account";
import AccountType from "../controllers/accounttype";
import Category from "../controllers/category";
import User from "../controllers/user";

export async function read(c: Context) {
  const db = c.env.DB;
  const account = new Account(db);
  const accountType = new AccountType(db);
  const category = new Category(db);
  const user = new User(db);
  const reqUser = c.get("jwtPayload") || (c.get("user") as any);

  try {
    const result = await Promise.all([
      user.findById(reqUser.iduser),
      account.getAll(reqUser.iduser),
      category.getAll(reqUser.iduser),
      accountType.getAll(),
    ]);

    const userResult = result[0].getProperties();
    (userResult as any).Account = result[1];
    (userResult as any).Category = result[2];
    (userResult as any).Transaction = [];

    return c.json({
      User: userResult,
      AccountType: result[3],
    });
  } catch (err: any) {
    throw err;
  }
}

export async function update(c: Context) {
  const db = c.env.DB;
  const payload = await c.req.json();
  const reqUser = c.get("jwtPayload") || (c.get("user") as any);
  payload.iduser = reqUser.iduser;
  const user = new User(db, payload);

  try {
    await user.update();
    const userFound =
      payload.passwdold && payload.passwd ? await user.findByEmail(payload.email) : false;
    const isPasswordVerified = userFound
      ? await userFound
          .verifyPassword(payload.passwdold)
          .then(() => true)
          .catch(() => false)
      : true;

    if (userFound && !isPasswordVerified) {
      throw new Error("Invalid old password");
    }

    if (userFound && isPasswordVerified) {
      await user.updatePassword();
    }

    return c.json({});
  } catch (err: any) {
    throw err;
  }
}
