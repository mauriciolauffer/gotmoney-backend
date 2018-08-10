'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/accounttype');
const AccountType = require('../../../controllers/accounttype');
const Helper = require('../../helper/helper');
const CustomErrors = require('../../../utils/errors');
const sandbox = sinon.createSandbox();
const expect = chai.expect;
const dbMock = Helper.getMongoDbModelMock();
const dbError = CustomErrors.HTTP.get404();
const dataEntryTest = Helper.getFakeAccountType();
const dbEntryReturn = [dataEntryTest];

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
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'find').returns(dbMock);
      const account = new AccountType();
      return expect(account.getAll(dataEntryTest.iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('[0].idtype', dataEntryTest.idtype);
    });

    it('should fail to return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'find').returns(dbMock);
      const account = new AccountType();
      return expect(account.getAll()).to.eventually.be.rejectedWith(dbError)
        .and.to.have.property('status', 404);
    });
  });
});
