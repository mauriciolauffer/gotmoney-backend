import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import db from '../../../models/account';
import Account from '../../../controllers/account';
import * as Helper from '../../helper/helper';

const dbMock = Helper.getMongoDbModelMock();
const dbError = new Error();
const dataEntryTest = Helper.getFakeAccount();
const dbEntryReturn = [dataEntryTest];

describe('Account Controller', () => {
  describe('#constructor', () => {
    it('should get a new instance', () => {
      expect(new Account()).toBeInstanceOf(Object);
    });

    it('should get a new instance and set properties', () => {
      const account = new Account(dataEntryTest);
      expect(account).toHaveProperty('props');
      expect(account.props.iduser).toBe(dataEntryTest.iduser);
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
      const account = new Account();
      const result = await account.getAll(dataEntryTest.iduser);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
    });
  });

  describe('#create()', () => {
    it('should create a new entry into DB', async () => {
      vi.spyOn(db, 'create').mockResolvedValue(dbEntryReturn as any);
      const account = new Account(dataEntryTest);
      await expect(account.create()).resolves.toBeDefined();
    });
  });
});
