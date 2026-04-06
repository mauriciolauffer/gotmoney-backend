import { Context, Next } from 'hono';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

function getSchema(id: string, required: string[]) {
  return {
    $id: id,
    type: 'object',
    maxProperties: 15,
    properties: {
      iduser: {
        type: 'integer',
        maximum: 9999999999999999,
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

async function validate(schema: any, payload: any) {
  const validate = ajv.compile(schema);
  if (!validate(payload)) {
    const err = new Error('Invalid data!') as any;
    err.status = 400;
    err.validationErrors = validate.errors;
    return err;
  } else {
    return null;
  }
}

export async function isValidRecovery(c: Context, next: Next) {
  const schema = getSchema('login-recovery', ['email']);
  const body = await c.req.json();
  const err = await validate(schema, body);
  if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
  await next();
}

export async function isValidLogin(c: Context, next: Next) {
  const schema = getSchema('login', ['email', 'passwd']);
  const body = await c.req.json();
  const err = await validate(schema, body);
  if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
  await next();
}

export async function isValidSignup(c: Context, next: Next) {
  const schema = getSchema('signup', ['name', 'email', 'passwd']);
  const body = await c.req.json();
  const err = await validate(schema, body);
  if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
  await next();
}

export async function isValidUpdate(c: Context, next: Next) {
  const schema = getSchema('update', ['name']);
  const body = await c.req.json();
  const err = await validate(schema, body);
  if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
  await next();
}
