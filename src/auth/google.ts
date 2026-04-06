import User from '../controllers/user';
import mailer from '../utils/mailer';
import logger from '../utils/logger';

export async function googleAuth(profile: any, config: any) {
  let name = '';
  if (profile.displayName || profile.givenName || profile.familyName) {
    name = profile.displayName || (profile.givenName + ' ' + profile.familyName).trim();
  }
  const payload = {
    google: profile.id,
    email: profile.email,
    name: name,
  };
  const user = new User();

  try {
    const userFound = await user.findByGoogle(payload.google);
    return userFound.getProperties();
  } catch (err) {
    try {
      const userFound = await user.findByEmail(payload.email);
      userFound.props.google = payload.google;
      await userFound.updateGoogle();
      return userFound.getProperties();
    } catch (err2) {
      return createUser(payload, config);
    }
  }
}

async function createUser(payload: any, config: any) {
  payload.birthdate = new Date();
  const user = new User(payload);
  user.setId();
  user.setAutoPassword();
  const password = user.props.passwd;
  await user.create();
  try {
    await mailer.sendNewUser(user.props.email, password, config);
    logger.info('Email sent!');
  } catch (err) {
    logger.error(err);
  }
  return user.getProperties();
}
