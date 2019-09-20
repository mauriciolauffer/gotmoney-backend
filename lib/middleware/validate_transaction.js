'use strict';

const Ajv = require('ajv');

function getSchema(id, required) {
  return {
    id: id,
    type: 'object',
    properties: {
      iduser: {
        type: 'integer',
        maximum: 99999999999999999999
      },
      idtransaction: {
        type: 'integer',
        maximum: 99999999999999999999
      },
      idaccount: {
        type: 'integer',
        maximum: 99999999999999999999
      },
      idparent: {
        type: ['integer', 'null'],
        maximum: 99999999999999999999
      },
      idstatus: {
        type: 'integer',
        maximum: 9
      },
      description: {
        type: 'string',
        maxLength: 100
      },
      instalment: {
        type: 'string',
        maxLength: 6
      },
      amount: {
        type: 'number',
        default: 0,
        minimum: 0,
        maximum: 99999999999999999999
      },
      type: {
        type: 'string',
        maxLength: 1,
        enum: ['C', 'D']
      },
      startdate: {
        type: 'string',
        format: 'date-time',
        maxLength: 30
      },
      duedate: {
        type: 'string',
        format: 'date-time',
        maxLength: 30
      },
      tag: {
        type: ['string', 'null'],
        maxLength: 255
      },
      origin: {
        type: 'string',
        maxLength: 1,
        enum: ['W', 'A']
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
    const schema = getSchema('transaction', ['idtransaction', 'idaccount', 'idstatus', 'description',
                                             'instalment', 'amount', 'type', 'startdate', 'duedate']);
    next(validate(schema, req.body));
  };
}

function isValidCreate() {
  return function(req, res, next) {
    let validationErrors = null;
    const payload = req.body;
    const schema = getSchema('transaction', ['idtransaction', 'idaccount', 'idstatus', 'description',
                                             'instalment', 'amount', 'type', 'startdate', 'duedate']);
    if (Array.isArray(payload.data)) {
      payload.data.forEach((item) => {
        validationErrors = validate(schema, item);
        if (validationErrors !== null) {
          return null;
        }
      });
      next(validationErrors);
    } else {
      next(validate(schema, payload));
    }
  };
}

module.exports = {
  isValid,
  isValidCreate
};
