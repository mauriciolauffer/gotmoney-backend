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
      idaccount: {
        type: 'integer',
        maximum: 99999999999999999999
      },
      idtype: {
        type: 'integer',
        maximum: 99999999999999999999
      },
      description: {
        type: 'string',
        maxLength: 50
      },
      creditlimit: {
        type: 'number',
        default: 0,
        minimum: 0,
        maximum: 99999999999999999999
      },
      balance: {
        type: 'number',
        default: 0,
        maximum: 99999999999999999999
      },
      openingdate: {
        type: 'string',
        format: 'date-time',
        maxLength: 30
      },
      duedate: {
        type: ['integer', 'null'],
        maximum: 31
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

function isValid() {
  return function(req, res, next) {
    const schema = getSchema('account', ['idaccount', 'idtype', 'description']);
    next(validate(schema, req.body));
  };
}

module.exports = isValid;
