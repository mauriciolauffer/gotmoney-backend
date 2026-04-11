import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

/**
 * Validates a payload against a JSON schema using Ajv.
 * @param schema - The JSON schema to validate against.
 * @param payload - The data to be validated.
 * @returns An error object if validation fails, otherwise null.
 */
export function validate(schema: any, payload: any): any | null {
  const validator = schema.$id ? (ajv.getSchema(schema.$id) || ajv.compile(schema)) : ajv.compile(schema);
  if (!validator(payload)) {
    const err = new Error("Invalid data!") as any;
    err.status = 400;
    err.validationErrors = validator.errors;
    return err;
  }
  return null;
}

export default {
  validate,
  ajv,
};
