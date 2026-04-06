import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as route from '../../../routes/user_process';
import User from '../../../controllers/user';
import Account from '../../../controllers/account';
import Category from '../../../controllers/category';
import AccountType from '../../../controllers/accounttype';
import * as Helper from '../../helper/helper';

const dbMock = Helper.getD1DatabaseMock();
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
      env: {
        DB: dbMock
      }
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('#read', () => {
    it('should read user data', async () => {
       vi.spyOn(User.prototype, 'findById').mockResolvedValue(new User(dbMock, dataEntryTest));
       vi.spyOn(Account.prototype, 'getAll').mockResolvedValue([]);
       vi.spyOn(Category.prototype, 'getAll').mockResolvedValue([]);
       vi.spyOn(AccountType.prototype, 'getAll').mockResolvedValue([]);

       await route.read(c);
       expect(c.json).toHaveBeenCalled();
    });
  });

  describe('#update', () => {
    it('should update user data', async () => {
      vi.spyOn(User.prototype, 'update').mockResolvedValue({});

      await route.update(c);
      expect(c.json).toHaveBeenCalled();
    });
  });
});
