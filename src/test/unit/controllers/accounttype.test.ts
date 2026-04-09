import { describe, it, expect, afterEach, vi } from "vitest";
import AccountType from "../../../controllers/accounttype";
import * as Helper from "../../helper/helper";
import CustomErrors from "../../../utils/errors";

const dbMock = Helper.getD1DatabaseMock();
const dbError = CustomErrors.HTTP.get404();
const dataEntryTest = Helper.getFakeAccountType();
const dbEntryReturn = [dataEntryTest];

describe("AccountType Controller", () => {
  describe("#constructor", () => {
    it("should get a new instance", () => {
      expect(new AccountType(dbMock)).toBeInstanceOf(Object);
    });
  });

  describe("#getAll()", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should return all entries from DB", async () => {
      const allMock = vi.fn().mockResolvedValue({ results: dbEntryReturn, meta: {} });
      vi.mocked(dbMock.prepare).mockReturnValue({
        all: allMock,
        bind: vi.fn().mockReturnThis(),
        first: vi.fn(),
        run: vi.fn(),
      } as any);

      const accountType = new AccountType(dbMock);
      const result = await accountType.getAll();
      expect(result).toBeInstanceOf(Array);
      expect(result[0].idtype).toBe(dataEntryTest.idtype);
    });

    it("should fail to return all entries from DB", async () => {
      const allMock = vi.fn().mockRejectedValue(dbError);
      vi.mocked(dbMock.prepare).mockReturnValue({
        all: allMock,
        bind: vi.fn().mockReturnThis(),
        first: vi.fn(),
        run: vi.fn(),
      } as any);

      const accountType = new AccountType(dbMock);
      await expect(accountType.getAll()).rejects.toThrow();
    });
  });
});
