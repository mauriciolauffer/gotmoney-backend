'use strict';

let logger;

try {
  logger = require('./utils/logger');
  logger.info('Starting app: ' + new Date().toJSON());
  const app = require('./app');
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    logger.info('Listening port: ' + port);
  });

} catch (err) {
  if (logger) {
    logger.error(err);
  } else {
    console.error(err);
  }
}

/*
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  // Listen to worker exiting
  cluster.on('exit', (worker, code, signal) => {
    logger.info('Worker ' + worker.process.pid + ' died!');
    if (signal) {
      logger.info('Worker was killed by signal: ' + signal);
    } else if (code !== 0) {
      logger.info('Worker exited with error code: ' + code);
    } else {
      logger.info('Worker success!');
    }
  });
} else {
  // Workers can share any TCP connection
  app.listen(port, () => {
    logger.info('Listening port: ' + port);
  });
}*/
