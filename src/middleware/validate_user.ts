import { Context, Next } from "hono";
import { validate } from "../utils/validation";

function getSchema(id: string, required: string[]) {
  return {
    $id: id,
    type: "object",
    maxProperties: 15,
    properties: {
      iduser: {
        type: "integer",
        maximum: Number.MAX_SAFE_INTEGER,
      },
      name: {
        type: "string",
        maxLength: 80,
      },
      email: {
        type: "string",
        format: "email",
        maxLength: 60,
      },
      passwd: {
        type: "string",
        minLength: 6,
        maxLength: 100,
      },
      alert: {
        type: "boolean",
      },
    },
    required: required,
  };
}

export async function isValidRecovery(c: Context, next: Next) {
  const schema = getSchema("login-recovery", ["email"]);
  const body = await c.req.json();
  const err = await validate(schema, body);
  if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
  await next();
}

export async function isValidLogin(c: Context, next: Next) {
  const schema = getSchema("login", ["email", "passwd"]);
  const body = await c.req.json();
  const err = await validate(schema, body);
  if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
  await next();
}

export async function isValidSignup(c: Context, next: Next) {
  const schema = getSchema("signup", ["name", "email", "passwd"]);
  const body = await c.req.json();
  const err = await validate(schema, body);
  if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
  await next();
}

export async function isValidUpdate(c: Context, next: Next) {
  const schema = getSchema("update", ["name"]);
  const body = await c.req.json();
  const err = await validate(schema, body);
  if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
  await next();
}
