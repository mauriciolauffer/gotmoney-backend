'use strict';

const logger = require('../utils/logger');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

const strategy = new JwtStrategy(jwtOptions, function(jwtPayload, next) {
  logger.info('payload received', jwtPayload);
  // usually this would be a database call:
  const user = {};// users[_.findIndex(users, {id: jwt_payload.id})];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }

  /* let userFound;
  const user = new User();
  user.findByEmail(username)
    .then((result) => {
      userFound = result;
      return userFound.verifyPassword(password);
    })
    .then(() => done(null, userFound.getProperties()))
    .catch(() => {
      const err = new Error('Invalid username/password!');
      err.status = 401;
      return done(err, null);
    });*/
});

module.exports = {
  jwt: strategy,
};
