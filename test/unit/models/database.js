'use strict';

const db = require('../../../models/database');
const { expect } = require('chai');

describe('Database', () => {
  describe('ENV variables', () => {
    it('should get ENV variables', () => {
      expect(process.env).to.have.property('NODE_ENV', 'test');
      expect(process.env).to.have.property('DB_HOST');
      expect(process.env).to.have.property('DB_PORT');
      expect(process.env).to.have.property('DB_USER');
      expect(process.env).to.have.property('DB_PASSWORD');
      expect(process.env).to.have.property('DB_NAME');
    });
  });

  describe('#executePromise()', () => {
    it('should execute SQL command', async() => {
      const sql = 'SELECT 1 AS res';
      const result = await db.executePromise(sql, []);
      expect(result).to.be.an('array').and.to.have.deep.nested.property('[0].res', 1);
    });

    it('should execute SQL command with parameters', async() => {
      const sql = 'SELECT ? + ? AS res';
      const parameters = [5, 10];
      const result = await db.executePromise(sql, parameters);
      expect(result).to.be.an('array').and.to.have.deep.nested.property('[0].res', 15);
    });

    it('should execute SQL command and return empty array', async() => {
      const sql = 'SELECT * FROM accounttypes WHERE 1 = 2';
      const result = await db.executePromise(sql, []);
      expect(result).to.be.an('array');
    });

    it('should execute SQL command with error', async() => {
      const sql = 'SELECT ? + ?';
      const parameters = ['a'];
      try {
        await db.executePromise(sql, parameters);
        expect(1).to.equal(2); //Should not be executed

      } catch (err) {
        expect(err).to.be.an('error');
      }
    });
  });

  describe('#queryPromise()', () => {
    it('should execute SQL command', async() => {
      const sql = 'SELECT 1 AS res';
      const result = await db.queryPromise(sql, []);
      expect(result).to.be.an('array').and.to.have.deep.nested.property('[0].res', 1);
    });

    it('should execute SQL command with parameters', async() => {
      const sql = 'SELECT ? + ? AS res';
      const parameters = [5, 10];
      const result = await db.queryPromise(sql, parameters);
      expect(result).to.be.an('array').and.to.have.deep.nested.property('[0].res', 15);
    });

    it('should execute SQL command and return error for not found', async() => {
      const sql = 'SELECT * FROM accounttypes WHERE 1 = 2';
      try {
        await db.queryPromise(sql, []);
        expect(1).to.equal(2); //Should not be executed

      } catch (err) {
        expect(err).to.be.an('error');
      }
    });

    it('should execute SQL command with error', async() => {
      const sql = 'SELECT ? + ?';
      const parameters = ['a'];
      try {
        await db.queryPromise(sql, parameters);
        expect(1).to.equal(2); //Should not be executed

      } catch (err) {
        expect(err).to.be.an('error');
      }
    });
  });
});
