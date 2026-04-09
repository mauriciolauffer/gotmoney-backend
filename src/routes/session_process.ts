import { Context } from "hono";
import logger from "../utils/logger";
import User from "../controllers/user";
import mailer from "../utils/mailer";

export async function ok(c: Context) {
  return c.json({});
}

export async function userLogin(c: Context) {
  const user = c.get("user") as any;
  const userSession = {
    iduser: user.iduser,
    email: user.email,
    name: user.name,
  };
  return c.json(userSession);
}

export async function userLogout(c: Context) {
  return c.json({});
}

export async function userSignup(c: Context) {
  const user = c.get("user") as any;
  const userSession = {
    iduser: user.iduser,
    email: user.email,
    name: user.name,
  };
  return c.json(userSession, 201);
}

export async function passwordRecovery(c: Context) {
  const db = c.env.DB;
  const user = new User(db);
  const payload = await c.req.json();
  let password;
  try {
    const userFound = await user.findByEmail(payload.email);
    userFound.setAutoPassword();
    password = userFound.props.passwd;
    await userFound.updatePassword();

    mailer
      .sendRecoveryPassword(payload.email, password!, c.env)
      .then(() => logger.info("Email sent!"))
      .catch((err) => logger.error(err));

    return c.json({});
  } catch (err: any) {
    logger.error(err);
    throw err;
  }
}
