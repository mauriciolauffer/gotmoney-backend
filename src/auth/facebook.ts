import User from "../controllers/user";
import mailer from "../utils/mailer";
import logger from "../utils/logger";

export async function facebookAuth(profile: any, config: any) {
  const payload = {
    facebook: profile.id,
    email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
    name: profile.displayName,
  };
  const db = config.DB;
  const user = new User(db);

  try {
    const userFound = await user.findByFacebook(payload.facebook);
    return userFound.getProperties();
  } catch (err) {
    logger.error(err);
    try {
      const userFound = await user.findByEmail(payload.email);
      userFound.props.facebook = payload.facebook;
      await userFound.updateFacebook();
      return userFound.getProperties();
    } catch (err2) {
      logger.error(err2);
      return createUser(payload, config);
    }
  }
}

async function createUser(payload: any, config: any) {
  payload.birthdate = new Date();
  const db = config.DB;
  const user = new User(db, payload);
  user.setId();
  user.setAutoPassword();
  const password = user.props.passwd;
  await user.create();
  try {
    await mailer.sendNewUser(user.props.email, password!, config);
    logger.info("Email sent!");
  } catch (err) {
    logger.error(err);
  }
  return user.getProperties();
}
