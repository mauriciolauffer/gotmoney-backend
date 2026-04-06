import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as route from '../../../routes/account_process';
import db from '../../../models/account';
import * as Helper from '../../helper/helper';

const dbMock = Helper.getMongoDbModelMock();
const dataEntryTest = Helper.getFakeAccount();
const dbEntryReturn = [dataEntryTest];

describe('Account Process Route', () => {
  let c: any;

  beforeEach(() => {
    c = {
      req: {
        json: vi.fn().mockResolvedValue(dataEntryTest),
        param: vi.fn().mockReturnValue(dataEntryTest.idaccount),
      },
      get: vi.fn().mockReturnValue(dataEntryTest),
      json: vi.fn().mockImplementation((data, status) => ({ data, status })),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('#create', () => {
    it('should create a new entry into DB', async () => {
      vi.spyOn(db, 'create').mockResolvedValue(dbEntryReturn as any);
      await route.create(c);
      expect(c.json).toHaveBeenCalledWith({}, 201);
    });
  });

  describe('#read', () => {
    it('should find entries into DB', async () => {
      vi.spyOn(db, 'find').mockReturnValue(dbMock as any);
      vi.spyOn(dbMock, 'exec').mockResolvedValue(dbEntryReturn);
      await route.read(c);
      expect(c.json).toHaveBeenCalledWith(dbEntryReturn);
    });
  });

  describe('#update', () => {
    it('should update an entry into DB', async () => {
      vi.spyOn(db, 'findOneAndUpdate').mockReturnValue(dbMock as any);
      vi.spyOn(dbMock, 'exec').mockResolvedValue(dbEntryReturn);
      await route.update(c);
      expect(c.json).toHaveBeenCalledWith({});
    });
  });

  describe('#remove', () => {
    it('should delete an entry from DB', async () => {
      vi.spyOn(db, 'findOneAndDelete').mockReturnValue(dbMock as any);
      vi.spyOn(dbMock, 'exec').mockResolvedValue(dbEntryReturn);
      await route.remove(c);
      expect(c.json).toHaveBeenCalledWith({});
    });
  });
});
