import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import faker from 'faker';
import bcrypt from 'bcryptjs';
import db from '../../../models/user';
import User from '../../../controllers/user';
import * as Helper from '../../helper/helper';

const dbMock = Helper.getMongoDbModelMock();
const dbError = new Error();
const dataEntryTest = Helper.getFakeUser();
const dbEntryReturn = [dataEntryTest];

describe('User Controller', () => {
  describe('#constructor', () => {
    it('should get a new instance', () => {
      expect(new User()).toBeInstanceOf(Object);
    });

    it('should get a new instance and set properties', () => {
      const user = new User(dataEntryTest);
      expect(user).toHaveProperty('props');
      expect(user.props.iduser).toBe(dataEntryTest.iduser);
      expect(user.props.name).toBe(dataEntryTest.name);
      expect(user.props.email).toBe(dataEntryTest.email);
      expect(user.props.createdon).toBe(dataEntryTest.createdon);
      expect(user.props.passwd).toBe(dataEntryTest.passwd);
      expect(user.props.alert).toBe(dataEntryTest.alert);
      expect(user.props.active).toBe(dataEntryTest.active);
      expect(user.props.facebook).toBe(dataEntryTest.facebook);
      expect(user.props.google).toBe(dataEntryTest.google);
      expect(user.props.twitter).toBe(dataEntryTest.twitter);
    });
  });

  describe('#setProperties()', () => {
    it('should set properties for instance', () => {
      const user = new User();
      user.setProperties(dataEntryTest);
      expect(user.props.iduser).toBe(dataEntryTest.iduser);
    });
  });

  describe('#getProperties()', () => {
    it('should get properties from instance', () => {
      const user = new User(dataEntryTest);
      const data = user.getProperties();
      expect(data.iduser).toBe(dataEntryTest.iduser);
      expect(data.passwd).toBeUndefined();
    });
  });

  describe('#hashPassword()', () => {
    it('should create a hash from a given password', async () => {
      const user = new User();
      const hash = await user.hashPassword(dataEntryTest.passwd);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });

    it('should fail when create a hash from a given password', async () => {
      vi.spyOn(bcrypt, 'hash').mockRejectedValue(dbError as never);
      const user = new User();
      await expect(user.hashPassword(null as any)).rejects.toThrow();
      vi.restoreAllMocks();
    });
  });

  describe('#verifyPassword()', () => {
    let passwordHash: string;

    beforeEach(async () => {
      const user = new User();
      passwordHash = await user.hashPassword(dataEntryTest.passwd);
    });

    it('should compare password to hash', async () => {
      const user = new User();
      user.props.passwd = passwordHash;
      await expect(user.verifyPassword(dataEntryTest.passwd)).resolves.toBeUndefined();
    });

    it('should fail when compare password to hash', async () => {
      const user = new User();
      const password = dataEntryTest.passwd + Date.now();
      user.props.passwd = passwordHash;
      await expect(user.verifyPassword(password)).rejects.toThrow();
    });
  });

  describe('#findByID()', () => {
    let _user: User;
    beforeEach(() => {
      vi.spyOn(db, 'findOne').mockReturnValue(dbMock as any);
      _user = new User();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should find an entry into DB by ID', async () => {
      vi.spyOn(dbMock, 'exec').mockResolvedValue(dbEntryReturn[0]);
      const foundUser = await _user.findById(dataEntryTest.iduser);
      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser.props.iduser).toBe(dataEntryTest.iduser);
    });

    it('should NOT find any entry into DB by ID', async () => {
      vi.spyOn(dbMock, 'exec').mockResolvedValue(null);
      await expect(_user.findById(dataEntryTest.iduser)).rejects.toThrow();
    });
  });

  describe('#create()', () => {
    it('should create a new entry into DB', async () => {
      vi.spyOn(db, 'create').mockResolvedValue(dbEntryReturn as any);
      const user = new User(dataEntryTest);
      await expect(user.create()).resolves.toBeDefined();
      vi.restoreAllMocks();
    });
  });
});
