import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as route from '../../../routes/user_process';
import db from '../../../models/user';
import accountDb from '../../../models/account';
import categoryDb from '../../../models/category';
import accountTypeDb from '../../../models/accounttype';
import * as Helper from '../../helper/helper';

const dbMock = Helper.getMongoDbModelMock();
const dataEntryTest = Helper.getFakeUser();

describe('User Process Route', () => {
  let c: any;

  beforeEach(() => {
    c = {
      req: {
        json: vi.fn().mockResolvedValue(dataEntryTest),
        param: vi.fn().mockReturnValue(dataEntryTest.iduser),
      },
      get: vi.fn().mockReturnValue(dataEntryTest),
      json: vi.fn().mockImplementation((data) => data),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('#read', () => {
    it('should read user data', async () => {
       vi.spyOn(db, 'findOne').mockReturnValue(dbMock as any);
       vi.spyOn(accountDb, 'find').mockReturnValue(dbMock as any);
       vi.spyOn(categoryDb, 'find').mockReturnValue(dbMock as any);
       vi.spyOn(accountTypeDb, 'find').mockReturnValue(dbMock as any);
       vi.spyOn(dbMock, 'exec').mockResolvedValue(dataEntryTest);

       await route.read(c);
       expect(c.json).toHaveBeenCalled();
    });
  });

  describe('#update', () => {
    it('should update user data', async () => {
      vi.spyOn(db, 'findOneAndUpdate').mockReturnValue(dbMock as any);
      vi.spyOn(dbMock, 'exec').mockResolvedValue(dataEntryTest);

      await route.update(c);
      expect(c.json).toHaveBeenCalled();
    });
  });
});
