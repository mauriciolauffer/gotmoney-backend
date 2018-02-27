'use strict';

const logger = require('winston');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info('Listening port: ' + port);
});

/*if (cluster.isMaster) {
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
