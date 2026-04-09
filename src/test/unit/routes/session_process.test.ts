import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as route from "../../../routes/session_process";
import * as Helper from "../../helper/helper";

const fakeUser = Helper.getFakeUser();
const dataEntryTest = {
  iduser: fakeUser.iduser,
  email: fakeUser.email,
  name: fakeUser.name,
};

describe("Session Process Route", () => {
  let c: any;

  beforeEach(() => {
    c = {
      req: {
        json: vi.fn().mockResolvedValue(dataEntryTest),
      },
      get: vi.fn().mockReturnValue(dataEntryTest),
      json: vi.fn().mockImplementation((data, status) => ({ data, status })),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("#ok", () => {
    it("should return OK", async () => {
      await route.ok(c);
      expect(c.json).toHaveBeenCalledWith({});
    });
  });

  describe("#userLogin", () => {
    it("should return user info", async () => {
      await route.userLogin(c);
      expect(c.json).toHaveBeenCalledWith(dataEntryTest);
    });
  });

  describe("#userLogout", () => {
    it("should return empty object", async () => {
      await route.userLogout(c);
      expect(c.json).toHaveBeenCalledWith({});
    });
  });

  describe("#userSignup", () => {
    it("should return user info with 201 status", async () => {
      await route.userSignup(c);
      expect(c.json).toHaveBeenCalledWith(dataEntryTest, 201);
    });
  });
});
