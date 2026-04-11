import { describe, it, expect } from "vitest";
import { BaseController } from "../../../controllers/base";

class TestController extends BaseController<any> {
  setProperties(data: any): any {
    return data;
  }
}

describe("BaseController", () => {
  const mockDb = {} as D1Database;

  it("should initialize with db and props", () => {
    const data = { name: "test" };
    const controller = new TestController(mockDb, data);
    expect(controller.db).toBe(mockDb);
    expect(controller.props).toEqual(data);
  });

  it("should return a copy of object props via getProperties", () => {
    const data = { name: "test" };
    const controller = new TestController(mockDb, data);
    const props = controller.getProperties();
    expect(props).toEqual(controller.props);
    expect(props).not.toBe(controller.props);
  });

  it("should return a copy of array props via getProperties", () => {
    const data = [{ id: 1 }, { id: 2 }];
    const controller = new TestController(mockDb, data);
    const props = controller.getProperties();
    expect(props).toEqual(controller.props);
    expect(props).not.toBe(controller.props);
    expect(Array.isArray(props)).toBe(true);
  });

  it("should return primitive props directly via getProperties", () => {
    const controller = new TestController(mockDb, "test-string");
    expect(controller.getProperties()).toBe("test-string");

    const controllerNull = new TestController(mockDb, null);
    expect(controllerNull.getProperties()).toBeNull();
  });
});
