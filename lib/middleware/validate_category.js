'use strict';

import { createMiddleware } from 'hono/factory'
import Ajv from 'ajv'

function getSchema(id, required) {
  return {
    id: id,
    type: 'object',
    maxProperties: 15,
    properties: {
      description: {
        type: 'string',
        maxLength: 80,
      },
      budget: {
        type: 'number',
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
    const schema = getSchema('create', ['description']);
    const error = validate(schema, body);
    if (error) {
        return c.json(error, 400)
    }
    await next();
});

export const isValidUpdate = createMiddleware(async (c, next) => {
    const body = await c.req.json()
    const schema = getSchema('update', ['description']);
    const error = validate(schema, body);
    if (error) {
        return c.json(error, 400)
    }
    await next();
});
