import { describe, it, expect } from "vitest";
import Errors from "../../../utils/errors";

describe("Errors", () => {
  describe("Custom errors", () => {
    it("should have an HTTP property", () => {
      expect(Errors).toBeInstanceOf(Object);
      expect(Errors.HTTP).toBeInstanceOf(Object);
    });
  });

  describe("#Custom Errors HTTP", () => {
    it("should return a 404 error", () => {
      expect(Errors.HTTP.get404()).toBeInstanceOf(Error);
      expect(Errors.HTTP.get404()).toHaveProperty("status", 404);
    });
  });
});
