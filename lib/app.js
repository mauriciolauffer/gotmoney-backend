'use strict';

require('dotenv').config();
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('./utils/logger');
const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const csrf = require('csurf');
const sha1 = require('crypto-js/sha1');
const app = express();
const corsOrigin = (process.env.CORS_ORIGIN === '*') ? process.env.CORS_ORIGIN : new RegExp('^' + process.env.CORS_ORIGIN);
const corsParams = {
  origin: corsOrigin,
  credentials: true,
  allowHeaders: ['Content-Type', 'x-xsrf-token', 'X-CSRF-Token', 'x-csrf-token', 'X-Requested-With', 'Accept',
    'Expires', 'Last-Modified', 'Cache-Control', 'Access_token', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie', 'x-xsrf-token', 'X-CSRF-Token', 'x-csrf-token', 'X-Got-Money'],
};
mongoose.connect(process.env.DB_URL, {
  ssl: true,
  useNewUrlParser: true,
})
    .then()
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
const sessionData = {
  name: 'gotmoney.sid',
  resave: false,
  saveUninitialized: false,
  secret: sha1([new Date().toISOString(), process.env.SESSION_SECRET, Math.random()].join()).toString(),
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {
    secure: process.env.COOKIE_SECURE === true,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
  },
};
sessionData.store.clear(() => true); // Clear all sessions when starting the app

if (app.get('env') === 'production') {
  app.use(morgan('combined', {'stream': logger.stream}));
} else {
  app.use(morgan('dev', {'stream': logger.stream}));
}

app.enable('trust proxy');
app.use(helmet());
app.use(compression());
app.use(cors(corsParams));
app.options('*', cors(corsParams));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session(sessionData));
app.use(csrf({cookie: false}));

require('./auth/authentication')(app);

app.use((req, res, next) => {
  res.set('X-Got-Money', sha1([Math.random(), new Date().toISOString(), Math.random()].join()));
  res.locals.csrftoken = req.csrfToken();
  res.locals.session = req.session;
  next();
});

app.use('/api', require('./routes'));

// Error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Production error handler no stacktraces leaked to user
app.use((err, req, res, next) => {
  const errorResponse = {
    message: err.message,
    messageCode: err.messageCode,
    error: (app.get('env') === 'development') ? err : {},
  };
  errorResponse.error = err.validationErrors || errorResponse.error;
  res.status(err.status || 500).json(errorResponse);
});

module.exports = app;
