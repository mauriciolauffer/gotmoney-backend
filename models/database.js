'use strict';

const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      return resolve(connection);
    });
  });
}

function executePromise(sql, parameters) {
  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => {
        connection.execute(sql, parameters, (err, result) => {
          connection.release();
          if (err) {
            return reject(err);
          } else if (!result || result.affectedRows === 0) {
            err = new Error('Not Found!');
            err.status = 404;
            return reject(err);
          }
          return resolve(result);
        });
      })
      .catch((err) => reject(err));
  });
}

function queryPromise(sql, parameters) {
  return new Promise((resolve, reject) => {
    getConnection()
      .then((connection) => {
        connection.query(sql, parameters, (err, result) => {
          connection.release();
          if (err) {
            return reject(err);
          } else if (!result || result.affectedRows === 0 || result.length === 0) {
            err = new Error('Not Found!');
            err.status = 404;
            return reject(err);
          }
          return resolve(result);
        });
      })
      .catch((err) => reject(err));
  });
}

module.exports = {
  executePromise,
  queryPromise
};
