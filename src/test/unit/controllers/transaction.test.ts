import { describe, it, expect, afterEach, vi } from 'vitest';
import Transaction from '../../../controllers/transaction';
import * as Helper from '../../helper/helper';

const dbMock = Helper.getD1DatabaseMock();
const dataEntryTest = Helper.getFakeTransaction();
const dbEntryReturn = [dataEntryTest];

describe('Transaction Controller', () => {
  describe('#constructor', () => {
    it('should get a new instance', () => {
      expect(new Transaction(dbMock)).toBeInstanceOf(Object);
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

      const transaction = new Transaction(dbMock);
      const result = await transaction.getAll(dataEntryTest.iduser);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
    });
  });

  describe('#createBatch()', () => {
    it('should create entries into DB', async () => {
      vi.mocked(dbMock.prepare).mockReturnValue({
        bind: vi.fn().mockReturnThis(),
        all: vi.fn(),
        first: vi.fn(),
        run: vi.fn(),
      } as any);
      vi.mocked(dbMock.batch).mockResolvedValue([{ meta: { changes: 1 } }] as any);
      const transaction = new Transaction(dbMock);
      await expect(transaction.createBatch([dataEntryTest])).resolves.toBeDefined();
    });
  });
});
