'use strict';

import { createMiddleware } from 'hono/factory'
import Ajv from 'ajv'

function getSchema(id, required) {
  return {
    id: id,
    type: 'object',
    maxProperties: 15,
    properties: {
        idaccount: {
            type: 'integer',
            maximum: 99999999999999999999,
        },
        idparent: {
            type: 'integer',
            maximum: 99999999999999999999,
        },
        idstatus: {
            type: 'integer',
            maximum: 99999999999999999999,
        },
        description: {
            type: 'string',
            maxLength: 80,
        },
        instalment: {
            type: 'integer',
        },
        amount: {
            type: 'number',
        },
        type: {
            type: 'string',
            maxLength: 1,
        },
        startdate: {
            type: 'string',
            format: 'date-time',
        },
        duedate: {
            type: 'string',
            format: 'date-time',
        },
        tag: {
            type: 'string',
            maxLength: 80,
        },
        origin: {
            type: 'string',
            maxLength: 80,
        },
    },
    required: required,
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

export const isValidCreate = createMiddleware(async (c, next) => {
    const body = await c.req.json()
    const schema = getSchema('create', ['idaccount', 'description', 'amount', 'type', 'startdate', 'duedate']);
    const error = validate(schema, body);
    if (error) {
        return c.json(error, 400)
    }
    await next();
});

export const isValidUpdate = createMiddleware(async (c, next) => {
    const body = await c.req.json()
    const schema = getSchema('update', ['idaccount', 'description', 'amount', 'type', 'startdate', 'duedate']);
    const error = validate(schema, body);
    if (error) {
        return c.json(error, 400)
    }
    await next();
});
