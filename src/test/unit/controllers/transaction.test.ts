import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import db from '../../../models/transaction';
import Transaction from '../../../controllers/transaction';
import * as Helper from '../../helper/helper';

const dbMock = Helper.getMongoDbModelMock();
const dbError = new Error();
const dataEntryTest = Helper.getFakeTransaction();
const dbEntryReturn = [dataEntryTest];

describe('Transaction Controller', () => {
  describe('#constructor', () => {
    it('should get a new instance', () => {
      expect(new Transaction()).toBeInstanceOf(Object);
    });
  });

  describe('#getAll()', () => {
    beforeEach(() => {
      vi.spyOn(db, 'find').mockReturnValue(dbMock as any);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return all entries from DB', async () => {
      vi.spyOn(dbMock, 'exec').mockResolvedValue(dbEntryReturn);
      const transaction = new Transaction();
      const result = await transaction.getAll(dataEntryTest.iduser);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
    });
  });

  describe('#createBatch()', () => {
    it('should create entries into DB', async () => {
      vi.spyOn(db, 'insertMany').mockResolvedValue(dbEntryReturn as any);
      const transaction = new Transaction();
      await expect(transaction.createBatch([dataEntryTest])).resolves.toBeDefined();
    });
  });
});
