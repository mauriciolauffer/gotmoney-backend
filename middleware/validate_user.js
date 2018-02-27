'use strict';

const Ajv = require('ajv');

function getSchema(id, required) {
  return {
    id: id,
    type: 'object',
    maxProperties: 15,
    properties: {
      iduser: {
        type: 'integer',
        maximum: 99999999999999999999
      },
      name: {
        type: 'string',
        maxLength: 80
      },
      gender: {
        type: 'string',
        enum: ['F', 'M'],
        maxLength: 1
      },
      birthdate: {
        type: 'string',
        format: 'date-time',
        maxLength: 30
      },
      email: {
        type: 'string',
        format: 'email',
        maxLength: 60
      },
      passwd: {
        type: 'string',
        minLength: 6,
        maxLength: 100
      },
      alert: {
        type: 'boolean'
      }
    },
    required: required
  };
}

function validate(schema, payload) {
  const ajv = new Ajv({allErrors: true});
  if (!ajv.validate(schema, payload)) {
    const err = new Error('Invalid data!');
    err.status = 400;
    err.validationErrors = ajv.errors;
    return err;
  } else {
    return null;
  }
}

function isValidRecovery() {
  return function(req, res, next) {
    const schema = getSchema('login', ['email']);
    next(validate(schema, req.body));
  };
}

function isValidLogin() {
  return function(req, res, next) {
    const schema = getSchema('login', ['email', 'passwd']);
    next(validate(schema, req.body));
  };
}

function isValidSignup() {
  return function(req, res, next) {
    const schema = getSchema('signup', ['name', 'gender', 'birthdate', 'email', 'passwd']);
    next(validate(schema, req.body));
  };
}

function isValidUpdate() {
  return function(req, res, next) {
    const schema = getSchema('update', ['name', 'gender', 'birthdate']);
    next(validate(schema, req.body));
  };
}

module.exports = {
  isValidLogin,
  isValidRecovery,
  isValidSignup,
  isValidUpdate
};
