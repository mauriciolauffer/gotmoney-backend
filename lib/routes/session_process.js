'use strict';

import User from '../controllers/user.js';
import mailer from '../utils/mailer.js';
import logger from '../utils/logger.js';

export function ok(c) {
  return c.json({}, 200);
}

export function userLogin(c) {
  const user = c.get('user');
  const userSession = {
    iduser: user.iduser,
    email: user.email,
    name: user.name,
  };
  return c.json(userSession);
}

export function userLogout(c) {
  const session = c.get('session');
  session.destroy();
  return c.json({});
}

export function userSignup(c) {
    const user = c.get('user');
    const userSession = {
      iduser: user.iduser,
      email: user.email,
      name: user.name,
    };
    return c.json(userSession, 201);
}

export async function passwordRecovery(c) {
  const user = new User();
  const payload = await c.req.json();
  let password;
  try {
    const userFound = await user.findByEmail(payload.email);
    userFound.setAutoPassword();
    password = userFound.props.passwd;
    await userFound.updatePassword();
    mailer.sendRecoveryPassword(payload.email, password)
        .then(() => logger.info('Email sent!'))
        .catch((err) => logger.error(err));
    return c.json({});
  } catch (err) {
    return c.json(err, 500);
  }
}
