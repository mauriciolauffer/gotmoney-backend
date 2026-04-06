import { Context, Next } from "hono";
import Ajv from "ajv";

function getSchema(id: string, required: string[]) {
  return {
    id: id,
    type: "object",
    properties: {
      iduser: {
        type: "integer",
        maximum: 99999999999999999999,
      },
      idtransaction: {
        type: "integer",
        maximum: 99999999999999999999,
      },
      idaccount: {
        type: "integer",
        maximum: 99999999999999999999,
      },
      idparent: {
        type: ["integer", "null"],
        maximum: 99999999999999999999,
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
        maximum: 99999999999999999999,
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

async function validate(schema: any, payload: any) {
  const ajv = new Ajv({ allErrors: true });
  if (!ajv.validate(schema, payload)) {
    const err = new Error("Invalid data!") as any;
    err.status = 400;
    err.validationErrors = ajv.errors;
    return err;
  } else {
    return null;
  }
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
