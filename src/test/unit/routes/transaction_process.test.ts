import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as route from '../../../routes/transaction_process';
import db from '../../../models/transaction';
import * as Helper from '../../helper/helper';

const dbMock = Helper.getMongoDbModelMock();
const dataEntryTest = Helper.getFakeTransaction();
const dbEntryReturn = [dataEntryTest];

describe('Transaction Process Route', () => {
  let c: any;

  beforeEach(() => {
    c = {
      req: {
        json: vi.fn().mockResolvedValue({ data: [dataEntryTest] }),
        param: vi.fn().mockReturnValue(dataEntryTest.idtransaction),
      },
      get: vi.fn().mockReturnValue(dataEntryTest),
      json: vi.fn().mockImplementation((data, status) => ({ data, status })),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('#create', () => {
    it('should create new entries into DB', async () => {
      vi.spyOn(db, 'insertMany').mockResolvedValue(dbEntryReturn as any);
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
       // user constructor within update handler will re-parse body
       c.req.json.mockResolvedValue(dataEntryTest);
      vi.spyOn(db, 'findOneAndUpdate').mockReturnValue(dbMock as any);
      vi.spyOn(dbMock, 'exec').mockResolvedValue(dataEntryTest);
      await route.update(c);
      expect(c.json).toHaveBeenCalledWith({});
    });
  });

  describe('#remove', () => {
    it('should delete an entry from DB', async () => {
      vi.spyOn(db, 'findOneAndDelete').mockReturnValue(dbMock as any);
      vi.spyOn(dbMock, 'exec').mockResolvedValue(dataEntryTest);
      await route.remove(c);
      expect(c.json).toHaveBeenCalledWith({});
    });
  });
});
