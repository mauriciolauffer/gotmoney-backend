'use strict';

import { createMiddleware } from 'hono/factory'
import Ajv from 'ajv'

function getSchema(id, required) {
  return {
    id: id,
    type: 'object',
    maxProperties: 15,
    properties: {
      iduser: {
        type: 'integer',
        maximum: 99999999999999999999,
      },
      name: {
        type: 'string',
        maxLength: 80,
      },
      email: {
        type: 'string',
        format: 'email',
        maxLength: 60,
      },
      passwd: {
        type: 'string',
        minLength: 6,
        maxLength: 100,
      },
      alert: {
        type: 'boolean',
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

export const isValidRecovery = createMiddleware(async (c, next) => {
    const body = await c.req.json()
    const schema = getSchema('login', ['email']);
    const error = validate(schema, body);
    if (error) {
        return c.json(error, 400)
    }
    await next();
});

export const isValidLogin = createMiddleware(async (c, next) => {
    const body = await c.req.json()
    const schema = getSchema('login', ['email', 'passwd']);
    const error = validate(schema, body);
    if (error) {
        return c.json(error, 400)
    }
    await next();
});

export const isValidSignup = createMiddleware(async (c, next) => {
    const body = await c.req.json()
    const schema = getSchema('signup', ['name', 'email', 'passwd']);
    const error = validate(schema, body);
    if (error) {
        return c.json(error, 400)
    }
    await next();
});

export const isValidUpdate = createMiddleware(async (c, next) => {
    const body = await c.req.json()
    const schema = getSchema('update', ['name']);
    const error = validate(schema, body);
    if (error) {
        return c.json(error, 400)
    }
    await next();
});
