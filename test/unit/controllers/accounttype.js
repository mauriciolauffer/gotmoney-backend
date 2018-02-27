'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/database');
const AccountType = require('../../../controllers/accounttype');
const sandbox = sinon.sandbox.create();
const expect = chai.expect;
const dataEntryTest = {
  idtype: 1,
  description: 2,
  icon: 3,
  inactive: 4
};
const dbEntryReturn = [dataEntryTest];
const dbError = new Error('Test error');
dbError.status = 404;

chai.use(chaiAsPromised);

describe('Account Type', () => {
  describe('#contructor', () => {
    it('should get a new instance', () => {
      expect(new AccountType()).to.be.instanceOf(Object);
    });
  });

  describe('#getAll()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should return all entries from DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const account = new AccountType();
      return expect(account.getAll(dataEntryTest.iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('[0].idtype', 1);
    });

    it('should fail to return all entries from DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const account = new AccountType();
      return expect(account.getAll()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });
});
