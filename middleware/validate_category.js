'use strict';

const Ajv = require('ajv');
function getSchema(id, required) {
  return {
    id: id,
    type: 'object',
    maxProperties: 10,
    properties: {
      iduser: {
        type: 'integer',
        maximum: 99999999999999999999
      },
      idcategory: {
        type: 'integer',
        maximum: 99999999999999999999
      },
      description: {
        type: 'string',
        maxLength: 50
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
    const schema = getSchema('category', ['idcategory', 'description']);
    next(validate(schema, req.body));
  };
}

module.exports = isValid;
