import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as route from '../../../routes/transaction_process';
import Transaction from '../../../controllers/transaction';
import * as Helper from '../../helper/helper';

const dbMock = Helper.getD1DatabaseMock();
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
      env: {
        DB: dbMock
      }
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('#create', () => {
    it('should create new entries into DB', async () => {
      vi.spyOn(Transaction.prototype, 'createBatch').mockResolvedValue(dbEntryReturn as any);
      await route.create(c);
      expect(c.json).toHaveBeenCalledWith({}, 201);
    });
  });

  describe('#read', () => {
    it('should find entries into DB', async () => {
      vi.spyOn(Transaction.prototype, 'getAll').mockResolvedValue(dbEntryReturn as any);
      await route.read(c);
      expect(c.json).toHaveBeenCalledWith(dbEntryReturn);
    });
  });

  describe('#update', () => {
    it('should update an entry into DB', async () => {
       // user constructor within update handler will re-parse body
       c.req.json.mockResolvedValue(dataEntryTest);
      vi.spyOn(Transaction.prototype, 'update').mockResolvedValue(dataEntryTest as any);
      await route.update(c);
      expect(c.json).toHaveBeenCalledWith({});
    });
  });

  describe('#remove', () => {
    it('should delete an entry from DB', async () => {
      vi.spyOn(Transaction.prototype, 'delete').mockResolvedValue(dataEntryTest as any);
      await route.remove(c);
      expect(c.json).toHaveBeenCalledWith({});
    });
  });
});
