import { describe, it, expect } from "vitest";
import { BaseController } from "../../../controllers/base";

class TestController extends BaseController<any> {
  setProperties(data: any): any {
    return { ...data, processed: true };
  }
}

describe("BaseController", () => {
  const mockDb = {} as D1Database;

  it("should initialize with db and processed props", () => {
    const data = { name: "test" };
    const controller = new TestController(mockDb, data);
    expect(controller.db).toBe(mockDb);
    expect(controller.props).toEqual({ name: "test", processed: true });
  });

  it("should return a copy of props via getProperties", () => {
    const data = { name: "test" };
    const controller = new TestController(mockDb, data);
    const props = controller.getProperties();
    expect(props).toEqual(controller.props);
    expect(props).not.toBe(controller.props);
  });
});
