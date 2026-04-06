import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import bcrypt from "bcryptjs";
import User from "../../../controllers/user";
import * as Helper from "../../helper/helper";

const dbMock = Helper.getD1DatabaseMock();
const dbError = new Error();
const dataEntryTest = Helper.getFakeUser();

describe("User Controller", () => {
  describe("#constructor", () => {
    it("should get a new instance", () => {
      expect(new User(dbMock)).toBeInstanceOf(Object);
    });

    it("should get a new instance and set properties", () => {
      const user = new User(dbMock, dataEntryTest);
      expect(user).toHaveProperty("props");
      expect(user.props.iduser).toBe(dataEntryTest.iduser);
      expect(user.props.name).toBe(dataEntryTest.name);
      expect(user.props.email).toBe(dataEntryTest.email);
      expect(user.props.passwd).toBe(dataEntryTest.passwd);
      expect(user.props.alert).toBe(dataEntryTest.alert);
      expect(user.props.active).toBe(dataEntryTest.active);
      expect(user.props.facebook).toBe(dataEntryTest.facebook);
      expect(user.props.google).toBe(dataEntryTest.google);
      expect(user.props.twitter).toBe(dataEntryTest.twitter);
    });
  });

  describe("#setProperties()", () => {
    it("should set properties for instance", () => {
      const user = new User(dbMock);
      const props = user.setProperties(dataEntryTest);
      expect(props.iduser).toBe(dataEntryTest.iduser);
    });
  });

  describe("#getProperties()", () => {
    it("should get properties from instance", () => {
      const user = new User(dbMock, dataEntryTest);
      const data = user.getProperties();
      expect(data.iduser).toBe(dataEntryTest.iduser);
      expect(data.passwd).toBeUndefined();
    });
  });

  describe("#hashPassword()", () => {
    it("should create a hash from a given password", async () => {
      const user = new User(dbMock);
      const hash = await user.hashPassword(dataEntryTest.passwd!);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
    });

    it("should fail when create a hash from a given password", async () => {
      vi.spyOn(bcrypt, "hash").mockRejectedValue(dbError as never);
      const user = new User(dbMock);
      await expect(user.hashPassword(null as any)).rejects.toThrow();
      vi.restoreAllMocks();
    });
  });

  describe("#verifyPassword()", () => {
    let passwordHash: string;

    beforeEach(async () => {
      const user = new User(dbMock);
      passwordHash = await user.hashPassword(dataEntryTest.passwd!);
    });

    it("should compare password to hash", async () => {
      const user = new User(dbMock);
      user.props.passwd = passwordHash;
      await expect(user.verifyPassword(dataEntryTest.passwd!)).resolves.toBeUndefined();
    });

    it("should fail when compare password to hash", async () => {
      const user = new User(dbMock);
      const password = dataEntryTest.passwd! + Date.now();
      user.props.passwd = passwordHash;
      await expect(user.verifyPassword(password)).rejects.toThrow();
    });
  });

  describe("#findByID()", () => {
    let _user: User;
    beforeEach(() => {
      _user = new User(dbMock);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should find an entry into DB by ID", async () => {
      const firstMock = vi.fn().mockResolvedValue(dataEntryTest);
      vi.mocked(dbMock.prepare).mockReturnValue({
        bind: vi.fn().mockReturnThis(),
        first: firstMock,
        all: vi.fn(),
        run: vi.fn(),
      } as any);

      const foundUser = await _user.findById(dataEntryTest.iduser);
      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser.props.iduser).toBe(dataEntryTest.iduser);
    });

    it("should NOT find any entry into DB by ID", async () => {
      const firstMock = vi.fn().mockResolvedValue(null);
      vi.mocked(dbMock.prepare).mockReturnValue({
        bind: vi.fn().mockReturnThis(),
        first: firstMock,
        all: vi.fn(),
        run: vi.fn(),
      } as any);

      await expect(_user.findById(dataEntryTest.iduser)).rejects.toThrow();
    });
  });

  describe("#create()", () => {
    it("should create a new entry into DB", async () => {
      const runMock = vi.fn().mockResolvedValue({ meta: { changes: 1 } });
      vi.mocked(dbMock.prepare).mockReturnValue({
        bind: vi.fn().mockReturnThis(),
        first: vi.fn(),
        all: vi.fn(),
        run: runMock,
      } as any);

      const user = new User(dbMock, dataEntryTest);
      await expect(user.create()).resolves.toBeDefined();
    });
  });
});
