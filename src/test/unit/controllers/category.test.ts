import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import db from '../../../models/category';
import Category from '../../../controllers/category';
import * as Helper from '../../helper/helper';

const dbMock = Helper.getMongoDbModelMock();
const dbError = new Error();
const dataEntryTest = Helper.getFakeCategory();
const dbEntryReturn = [dataEntryTest];

describe('Category Controller', () => {
  describe('#constructor', () => {
    it('should get a new instance', () => {
      expect(new Category()).toBeInstanceOf(Object);
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
      const category = new Category();
      const result = await category.getAll(dataEntryTest.iduser);
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
    });
  });

  describe('#create()', () => {
    it('should create a new entry into DB', async () => {
      vi.spyOn(db, 'create').mockResolvedValue(dbEntryReturn as any);
      const category = new Category(dataEntryTest);
      await expect(category.create()).resolves.toBeDefined();
    });
  });
});
