'use strict';

const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({
      colorize: true
    }),
    new winston.transports.File({
      filename: './logs/all-logs.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    })
  ]
});

logger.stream = {
  write: function(message) {
    logger.info(message);
  }
};

module.exports = logger;
