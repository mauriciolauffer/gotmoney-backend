'use strict';

require('dotenv').load();
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const logger = require('winston');
const morgan = require('morgan');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const csrf = require('csurf');
const sha1 = require('crypto-js/sha1');
const base64 = require('crypto-js/enc-base64');
const app = express();
const sessionData = {
  name: 'gotmoney.sid',
  secret: sha1(process.env.SESSION_SECRET + Math.random().toString()).toString(),
  resave: false,
  saveUninitialized: false,
  cookie: {}
};
const corsOrigin = new RegExp('^' + process.env.CORS_ORIGIN);
const corsParams = {
  origin: corsOrigin,
  credentials: true,
  allowHeaders: ['Content-Type', 'x-xsrf-token', 'X-CSRF-Token', 'x-csrf-token', 'X-Requested-With', 'Accept',
                 'Expires', 'Last-Modified', 'Cache-Control', 'Access_token', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie', 'x-xsrf-token', 'X-CSRF-Token', 'x-csrf-token', 'X-Got-Money']
};
logger.level = process.env.LOG_LEVEL;
sessionData.store = new MongoStore({
  url: [process.env.SESSION_PROTOCOL,
        process.env.SESSION_CREDENTIALS,
        process.env.SESSION_CLUSTERS,
        process.env.SESSION_DB,
        process.env.SESSION_PARAMETERS].join('')
});

//Clear all sessions when starting the app
sessionData.store.clear(() => true);

if (app.get('env') === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.enable('trust proxy');
app.use(helmet());
app.use(compression());
app.use(cors(corsParams));
app.options('*', cors(corsParams));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session(sessionData));
app.use(csrf({ cookie: false }));

require('./auth/authentication')(app);

app.use((req, res, next) => {
  res.set('X-Got-Money', base64.stringify(sha1(Math.random().toString() + new Date().toISOString())));
  res.locals.csrftoken = req.csrfToken();
  res.locals.session = req.session;
  next();
});

app.use('/api', require('./routes/index'));

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
    error: (app.get('env') === 'development') ? err : {}
  };
  errorResponse.error = err.validationErrors || errorResponse.error;
  res.status(err.status || 500).json(errorResponse);
});

module.exports = app;
