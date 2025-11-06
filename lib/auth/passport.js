import passport from 'passport';
import { jwt } from './jwt';
import { login, signup } from './local';
import { facebook } from './facebook';
import { google } from './google';

passport.serializeUser((user, done) => {
  const userSession = {
    iduser: user.iduser,
    email: user.email,
    name: user.name,
  };
  done(null, userSession);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use('jwt', jwt);
passport.use('local-login', login);
passport.use('local-signup', signup);
passport.use('facebook', facebook);
passport.use('google', google);

export default passport;
