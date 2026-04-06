import { describe, it, expect, afterEach, vi } from 'vitest';
import db from '../../../models/accounttype';
import AccountType from '../../../controllers/accounttype';
import * as Helper from '../../helper/helper';
import CustomErrors from '../../../utils/errors';

const dbMock = Helper.getMongoDbModelMock();
const dbError = CustomErrors.HTTP.get404();
const dataEntryTest = Helper.getFakeAccountType();
const dbEntryReturn = [dataEntryTest];

describe('AccountType Controller', () => {
  describe('#constructor', () => {
    it('should get a new instance', () => {
      expect(new AccountType()).toBeInstanceOf(Object);
    });
  });

  describe('#getAll()', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return all entries from DB', async () => {
      vi.spyOn(dbMock, 'exec').mockResolvedValue(dbEntryReturn);
      vi.spyOn(db, 'find').mockReturnValue(dbMock as any);
      const accountType = new AccountType();
      const result = await accountType.getAll();
      expect(result).toBeInstanceOf(Array);
      expect(result[0].idtype).toBe(dataEntryTest.idtype);
    });

    it('should fail to return all entries from DB', async () => {
      vi.spyOn(dbMock, 'exec').mockRejectedValue(dbError);
      vi.spyOn(db, 'find').mockReturnValue(dbMock as any);
      const accountType = new AccountType();
      await expect(accountType.getAll()).rejects.toThrow();
    });
  });
});
