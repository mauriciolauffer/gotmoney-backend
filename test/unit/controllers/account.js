'use strict';

const faker = require('faker');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/account');
const Account = require('../../../controllers/account');
const Helper = require('../../helper/helper');
const sandbox = sinon.createSandbox();
const expect = chai.expect;
const dbMock = Helper.getMongoDbModelMock();
const dbError = new Error();
const dataEntryTest = Helper.getFakeAccount();
const dbEntryReturn = [dataEntryTest];

chai.use(chaiAsPromised);

describe('Account', () => {
  describe('#contructor', () => {
    it('should get a new instance', () => {
      expect(new Account()).to.be.instanceOf(Object);
    });

    it('should get a new instance and set properties', () => {
      const account = new Account(dataEntryTest);
      expect(account).to.have.property('props');
      expect(account.props.iduser).to.equal(dataEntryTest.iduser);
      expect(account.props.idaccount).to.equal(dataEntryTest.idaccount);
      expect(account.props.idtype).to.equal(dataEntryTest.idtype);
      expect(account.props.description).to.equal(dataEntryTest.description);
      expect(account.props.creditlimit).to.equal(dataEntryTest.creditlimit);
      expect(account.props.balance).to.equal(dataEntryTest.balance);
      expect(account.props.openingdate).to.equal(dataEntryTest.openingdate);
      expect(account.props.duedate).to.equal(dataEntryTest.duedate);
    });
  });

  describe('#setProperties()', () => {
    it('should set properties for instance', () => {
      const account = new Account();
      account.setProperties(dataEntryTest);
      expect(account.props.iduser).to.equal(dataEntryTest.iduser);
      expect(account.props.idaccount).to.equal(dataEntryTest.idaccount);
      expect(account.props.idtype).to.equal(dataEntryTest.idtype);
      expect(account.props.description).to.equal(dataEntryTest.description);
      expect(account.props.creditlimit).to.equal(dataEntryTest.creditlimit);
      expect(account.props.balance).to.equal(dataEntryTest.balance);
      expect(account.props.openingdate).to.equal(dataEntryTest.openingdate);
      expect(account.props.duedate).to.equal(dataEntryTest.duedate);
    });
  });

  describe('#getProperties()', () => {
    it('should get properties from instance', () => {
      const account = new Account(dataEntryTest);
      const data = account.getProperties();
      expect(data.iduser).to.equal(dataEntryTest.iduser);
      expect(data.idaccount).to.equal(dataEntryTest.idaccount);
      expect(data.idtype).to.equal(dataEntryTest.idtype);
      expect(data.description).to.equal(dataEntryTest.description);
      expect(data.creditlimit).to.equal(dataEntryTest.creditlimit);
      expect(data.balance).to.equal(dataEntryTest.balance);
      expect(data.openingdate).to.equal(dataEntryTest.openingdate);
      expect(data.duedate).to.equal(dataEntryTest.duedate);
    });

    it('should change data from #getProperties() and does not affect instance', () => {
      const account = new Account(dataEntryTest);
      const data = account.getProperties();
      data.idaccount = faker.finance.account();
      expect(account.props.idaccount).to.equal(dataEntryTest.idaccount)
        .and.not.equal(data.idaccount);
    });
  });

  describe('#getAll()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'find').returns(dbMock);
      this._account = new Account();
    });

    afterEach(() => {
      sandbox.restore();
      this._account = null;
    });

    it('should return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._account.getAll(dataEntryTest.iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Array)
        .and.to.have.lengthOf(1)
        .and.to.have.nested.property('[0].idaccount', dataEntryTest.idaccount);
    });

    it('should return no entries, empty array, from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._account.getAll(dataEntryTest.iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Array)
        .and.to.have.lengthOf(0);
    });

    it('should fail to return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._account.getAll(dataEntryTest.iduser)).to.eventually.be.rejectedWith(Error)
        .and.to.not.have.property('status');
    });
  });

  describe('#findByID()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOne').returns(dbMock);
      this._account = new Account();
    });

    afterEach(() => {
      sandbox.restore();
      this._account = null;
    });

    it('should find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._account.findById(dataEntryTest.iduser, dataEntryTest.idaccount)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Account)
        .and.to.have.nested.property('props.idaccount', dataEntryTest.idaccount);
    });

    it('should NOT find any entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._account.findById(dataEntryTest.iduser, dataEntryTest.idaccount)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });

    it('should fail to find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._account.findById(dataEntryTest.iduser, dataEntryTest.idaccount)).to.eventually.be.rejectedWith(Error)
        .and.to.not.have.property('status');
    });
  });

  describe('#create()', () => {
    beforeEach(() => {
      this._account = new Account(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._account = null;
    });

    it('should create a new entry into DB', () => {
      sandbox.stub(db, 'create').resolves(dbEntryReturn);
      return expect(this._account.create()).to.eventually.be.fulfilled;
    });

    it('should fail when create a new entry into DB', () => {
      sandbox.stub(db, 'create').rejects(dbError);
      return expect(this._account.create()).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#update()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      this._account = new Account(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._account = null;
    });

    it('should update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      this._account.props.description = 'TEST';
      return expect(this._account.update()).to.eventually.be.fulfilled;
    });

    it('should NOT find any entry to update into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._account.update()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._account.update()).to.eventually.be.rejectedWith(Error)
        .and.to.not.have.property('status');
    });
  });

  describe('#delete()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOneAndDelete').returns(dbMock);
      this._account = new Account(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._account = null;
    });

    it('should delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._account.delete()).to.eventually.be.fulfilled;
    });

    it('should NOT find any entry to delete from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._account.delete()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });

    it('should fail when delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._account.delete()).to.eventually.be.rejectedWith(Error)
        .and.to.not.have.property('status');
    });
  });
});
