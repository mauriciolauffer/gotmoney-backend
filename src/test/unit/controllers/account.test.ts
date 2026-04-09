import { describe, it, expect, afterEach, vi } from "vitest";
import Account from "../../../controllers/account";
import * as Helper from "../../helper/helper";

const dbMock = Helper.getD1DatabaseMock();
const dataEntryTest = Helper.getFakeAccount();
const dbEntryReturn = [dataEntryTest];

describe("Account Controller", () => {
  describe("#constructor", () => {
    it("should get a new instance", () => {
      expect(new Account(dbMock)).toBeInstanceOf(Object);
    });

    it("should get a new instance and set properties", () => {
      const account = new Account(dbMock, dataEntryTest);
      expect(account).toHaveProperty("props");
      expect(account.props.iduser).toBe(dataEntryTest.iduser);
    });
  });

  describe("#getAll()", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should return all entries from DB", async () => {
      const allMock = vi.fn().mockResolvedValue({ results: dbEntryReturn, meta: {} });
      vi.mocked(dbMock.prepare).mockReturnValue({
        bind: vi.fn().mockReturnThis(),
        all: allMock,
        first: vi.fn(),
        run: vi.fn(),
      } as any);

      const account = new Account(dbMock);
      const result = await account.getAll(dataEntryTest.iduser);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
    });
  });

  describe("#create()", () => {
    it("should create a new entry into DB", async () => {
      const runMock = vi.fn().mockResolvedValue({ meta: { changes: 1 } });
      vi.mocked(dbMock.prepare).mockReturnValue({
        bind: vi.fn().mockReturnThis(),
        run: runMock,
        all: vi.fn(),
        first: vi.fn(),
      } as any);

      const account = new Account(dbMock, dataEntryTest);
      await expect(account.create()).resolves.toBeDefined();
    });
  });
});
