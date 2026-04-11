import { describe, it, expect } from "vitest";
import { validate } from "../../../utils/validation";

describe("Validation Utility", () => {
  const schema = {
    $id: "test",
    type: "object",
    properties: {
      name: { type: "string" },
      age: { type: "integer" },
    },
    required: ["name"],
  };

  it("should return null for valid data", async () => {
    const data = { name: "John", age: 30 };
    const result = await validate(schema, data);
    expect(result).toBeNull();
  });

  it("should return an error object for invalid data", async () => {
    const data = { age: "30" };
    const result = await validate(schema, data);
    expect(result).not.toBeNull();
    expect(result.status).toBe(400);
    expect(result.message).toBe("Invalid data!");
    expect(result.validationErrors).toBeDefined();
  });
});
