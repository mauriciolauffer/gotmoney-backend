import { Context, Next } from "hono";
import Ajv from "ajv";

function getSchema(id: string, required: string[]) {
  return {
    id: id,
    type: "object",
    maxProperties: 15,
    properties: {
      iduser: {
        type: "integer",
        maximum: Number.MAX_SAFE_INTEGER,
      },
      idaccount: {
        type: "integer",
        maximum: Number.MAX_SAFE_INTEGER,
      },
      idtype: {
        type: "integer",
        maximum: Number.MAX_SAFE_INTEGER,
      },
      description: {
        type: "string",
        maxLength: 50,
      },
      creditlimit: {
        type: "number",
        default: 0,
        minimum: 0,
        maximum: Number.MAX_SAFE_INTEGER,
      },
      balance: {
        type: "number",
        default: 0,
        maximum: Number.MAX_SAFE_INTEGER,
      },
      openingdate: {
        type: "string",
        format: "date-time",
        maxLength: 30,
      },
      duedate: {
        type: ["integer", "null"],
        maximum: 31,
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

export async function validateAccount(c: Context, next: Next) {
  const schema = getSchema("account", ["idaccount", "idtype", "description"]);
  const body = await c.req.json();
  const err = await validate(schema, body);
  if (err) return c.json({ message: err.message, validationErrors: err.validationErrors }, 400);
  await next();
}
