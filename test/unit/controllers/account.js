'use strict';

const faker = require('faker');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/account');
const Account = require('../../../controllers/account');
const Helper = require('../../helper/helper');
const CustomErrors = require('../../../utils/errors');
const sandbox = sinon.createSandbox();
const expect = chai.expect;
const dbMock = Helper.getMongoDbModelMock();
const dbError = CustomErrors.HTTP.get404();
const dataEntryTest = Helper.getFakeAccount();
const dbEntryReturn = [dataEntryTest];
const idAccountDoesNotExist = 9999999999;

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
    afterEach(() => {
      sandbox.restore();
    });

    it('should return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'find').returns(dbMock);
      const account = new Account();
      return expect(account.getAll(dataEntryTest.iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('[0].idaccount', dataEntryTest.idaccount);
    });

    it('should fail to return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'find').returns(dbMock);
      const iduser = 'A';
      const account = new Account();
      return expect(account.getAll(iduser)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#findByID()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const account = new Account();
      return expect(account.findById(dataEntryTest.iduser, dataEntryTest.idaccount)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('props.idaccount', dataEntryTest.idaccount);
    });

    it('should fail to find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const iduser = 'A';
      const idaccount = idAccountDoesNotExist;
      const account = new Account();
      return expect(account.findById(iduser, idaccount)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#create()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should create a new entry into DB', () => {
      sandbox.stub(db, 'create').resolves(dbEntryReturn);
      const account = new Account(dataEntryTest);
      return expect(account.create()).to.eventually.be.fulfilled;
    });

    it('should fail when create a new entry into DB', () => {
      sandbox.stub(db, 'create').rejects(dbError);
      const account = new Account(dataEntryTest);
      return expect(account.create()).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#update()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const account = new Account(dataEntryTest);
      account.props.description = 'TEST';
      return expect(account.update()).to.eventually.be.fulfilled;
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const account = new Account({
        iduser: 'A',
        idaccount: idAccountDoesNotExist
      });
      return expect(account.update()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#delete()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'findOneAndDelete').returns(dbMock);
      const account = new Account(dataEntryTest);
      return expect(account.delete()).to.eventually.be.fulfilled;
    });

    it('should fail when delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOneAndDelete').returns(dbMock);
      const account = new Account({
        iduser: 'A',
        idaccount: idAccountDoesNotExist
      });
      return expect(account.delete()).to.eventually.be.rejectedWith(Error);
    });
  });
});
