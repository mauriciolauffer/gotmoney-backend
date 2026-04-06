import { describe, it, expect, afterEach, vi } from 'vitest';
import Category from '../../../controllers/category';
import * as Helper from '../../helper/helper';

const dbMock = Helper.getD1DatabaseMock();
const dataEntryTest = Helper.getFakeCategory();
const dbEntryReturn = [dataEntryTest];

describe('Category Controller', () => {
  describe('#constructor', () => {
    it('should get a new instance', () => {
      expect(new Category(dbMock)).toBeInstanceOf(Object);
    });
  });

  describe('#getAll()', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return all entries from DB', async () => {
      const allMock = vi.fn().mockResolvedValue({ results: dbEntryReturn, meta: {} });
      vi.mocked(dbMock.prepare).mockReturnValue({
        all: allMock,
        bind: vi.fn().mockReturnThis(),
        first: vi.fn(),
        run: vi.fn(),
      } as any);

      const category = new Category(dbMock);
      const result = await category.getAll(dataEntryTest.iduser);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
    });
  });

  describe('#create()', () => {
    it('should create a new entry into DB', async () => {
      const runMock = vi.fn().mockResolvedValue({ meta: { changes: 1 } });
      vi.mocked(dbMock.prepare).mockReturnValue({
        run: runMock,
        bind: vi.fn().mockReturnThis(),
        all: vi.fn(),
        first: vi.fn(),
      } as any);

      const category = new Category(dbMock, dataEntryTest);
      await expect(category.create()).resolves.toBeDefined();
    });
  });
});
