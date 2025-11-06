'use strict';

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { compress } from 'hono/compress'
import { logger as honoLogger } from 'hono/logger'
import { csrf } from 'hono/csrf'
import { session } from '@hono/session'
import mongoose from 'mongoose'
import logger from './utils/logger.js'
import sha1 from 'crypto-js/sha1.js'
import store from './session/mongo.js'
import passport from './auth/passport.js'

const app = new Hono()

// Database connection
mongoose.connect(process.env.DB_URL, {
  ssl: true,
  useNewUrlParser: true,
})
    .then()
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });

// Middleware
app.use('*', cors({
  origin: (origin) => {
    if (process.env.CORS_ORIGIN === '*' || new RegExp('^' + process.env.CORS_ORIGIN).test(origin)) {
      return origin;
    }
  },
  credentials: true,
  allowHeaders: ['Content-Type', 'x-xsrf-token', 'X-CSRF-Token', 'x-csrf-token', 'X-Requested-With', 'Accept',
    'Expires', 'Last-Modified', 'Cache-Control', 'Access_token', 'Authorization', 'Cookie'],
  exposeHeaders: ['Set-Cookie', 'x-xsrf-token', 'X-CSRF-Token', 'x-csrf-token', 'X-Got-Money'],
}));
app.use('*', secureHeaders());
app.use('*', compress());
app.use('*', honoLogger());
app.use('*', session({
    store: store,
    secret: sha1([new Date().toISOString(), process.env.SESSION_SECRET, Math.random()].join()).toString(),
    cookieName: 'gotmoney.sid',
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === true,
    maxAge: 7 * 24 * 60 * 60,
}));
app.use('*', csrf());
app.use('*', passport.initialize());
app.use('*', passport.session());


// Custom middleware
app.use('*', async (c, next) => {
  c.header('X-Got-Money', sha1([Math.random(), new Date().toISOString(), Math.random()].join()));
  await next();
});


app.get('/', (c) => c.text('Hello Hono!'))

// Attach routes
import routes from './routes/index.js'
app.route('/api', routes)

// Error handler
app.onError((err, c) => {
  const errorResponse = {
    message: err.message,
    messageCode: err.messageCode,
    error: (process.env.NODE_ENV === 'development') ? err : {},
  };
  errorResponse.error = err.validationErrors || errorResponse.error;
  return c.json(errorResponse, err.status || 500);
});


export default app
