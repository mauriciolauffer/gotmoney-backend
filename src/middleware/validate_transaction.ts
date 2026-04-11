import { Context, Next } from "hono";
import { validate } from "../utils/validation";

function getSchema(id: string, required: string[]) {
  return {
    $id: id,
    type: "object",
    properties: {
      iduser: {
        type: "integer",
        maximum: Number.MAX_SAFE_INTEGER,
      },
      idtransaction: {
        type: "integer",
        maximum: Number.MAX_SAFE_INTEGER,
      },
      idaccount: {
        type: "integer",
        maximum: Number.MAX_SAFE_INTEGER,
      },
      idparent: {
        type: ["integer", "null"],
        maximum: Number.MAX_SAFE_INTEGER,
      },
      idstatus: {
        type: "integer",
        maximum: 9,
      },
      description: {
        type: "string",
        maxLength: 100,
      },
      instalment: {
        type: "string",
        maxLength: 6,
      },
      amount: {
        type: "number",
        default: 0,
        minimum: 0,
        maximum: Number.MAX_SAFE_INTEGER,
      },
      type: {
        type: "string",
        maxLength: 1,
        enum: ["C", "D"],
      },
      startdate: {
        type: "string",
        format: "date-time",
        maxLength: 30,
      },
      duedate: {
        type: "string",
        format: "date-time",
        maxLength: 30,
      },
      tag: {
        type: ["string", "null"],
        maxLength: 255,
      },
      origin: {
        type: "string",
        maxLength: 1,
        enum: ["W", "A"],
      },
    },
    required: required,
  };
}

export async function isValid(c: Context, next: Next) {
  const schema = getSchema("transaction", [
    "idtransaction",
    "idaccount",
    "idstatus",
    "description",
    "instalment",
    "amount",
    "type",
    "startdate",
    "duedate",
  ]);
  const body = await c.req.json();
  const err = await validate(schema, body);
  if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
  await next();
}

export async function isValidCreate(c: Context, next: Next) {
  const payload = await c.req.json();
  const schema = getSchema("transaction", [
    "idtransaction",
    "idaccount",
    "idstatus",
    "description",
    "instalment",
    "amount",
    "type",
    "startdate",
    "duedate",
  ]);

  if (Array.isArray(payload.data)) {
    for (const item of payload.data) {
      const err = await validate(schema, item);
      if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
    }
    await next();
  } else {
    const err = await validate(schema, payload);
    if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
    await next();
  }
}
