import { Context, Next } from 'hono';
import Ajv from 'ajv';

function getSchema(id: string, required: string[]) {
  return {
    id: id,
    type: 'object',
    maxProperties: 10,
    properties: {
      iduser: {
        type: 'integer',
        maximum: 99999999999999999999,
      },
      idcategory: {
        type: 'integer',
        maximum: 99999999999999999999,
      },
      description: {
        type: 'string',
        maxLength: 50,
      },
      budget: {
        type: 'integer',
        default: 0,
        minimum: 0,
        maximum: 99999999999999999999,
      },
    },
    required: required,
  };
}

async function validate(schema: any, payload: any) {
  const ajv = new Ajv({ allErrors: true });
  if (!ajv.validate(schema, payload)) {
    const err = new Error('Invalid data!') as any;
    err.status = 400;
    err.validationErrors = ajv.errors;
    return err;
  } else {
    return null;
  }
}

export async function validateCategory(c: Context, next: Next) {
  const schema = getSchema('category', ['idcategory', 'description']);
  const body = await c.req.json();
  const err = await validate(schema, body);
  if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
  await next();
}
