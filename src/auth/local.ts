import { Context } from 'hono';
import User from '../controllers/user';
import mailer from '../utils/mailer';
import logger from '../utils/logger';

export async function login(c: Context) {
  const { email, passwd } = await c.req.json();
  const user = new User();
  try {
    const userFound = await user.findByEmail(email);
    await userFound.verifyPassword(passwd);
    return userFound.getProperties();
  } catch (err) {
    throw new Error('Invalid username/password!');
  }
}

export async function signup(c: Context) {
  const body = await c.req.json();
  const user = new User(body);
  const existingUser = await (new User()).findByEmail(body.email).catch(() => null);

  if (existingUser) {
    const err = new Error('User already exist! Try another email.') as any;
    err.status = 400;
    throw err;
  }

  await user.create();
  try {
    await mailer.sendNewUser(user.props.email, body.passwd, c.env);
    logger.info('Email sent!');
  } catch (err) {
    logger.error(err);
  }
  return user.getProperties();
}
