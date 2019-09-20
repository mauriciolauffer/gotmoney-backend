'use strict';

const faker = require('faker');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/transaction');
const Transaction = require('../../../controllers/transaction');
const Helper = require('../../helper/helper');
const expect = chai.expect;
const sandbox = sinon.createSandbox();
const dbMock = Helper.getMongoDbModelMock();
const dbError = new Error();
const dataEntryTest = Helper.getFakeTransaction();
const dataEntryDbTest = Helper.getFakeTransaction();
dataEntryDbTest.idparent = null;
dataEntryDbTest.type = 'D';
const dbEntryReturn = [dataEntryTest];

chai.use(chaiAsPromised);

describe('Transaction', () => {
  describe('#contructor', () => {
    it('should get a new instance', () => {
      expect(new Transaction()).to.be.instanceOf(Object);
    });

    it('should get a new instance and set properties', () => {
      const transaction = new Transaction(dataEntryTest);
      expect(transaction).to.have.property('props');
      expect(transaction.props.iduser).to.equal(dataEntryTest.iduser);
      expect(transaction.props.idtransaction).to.equal(dataEntryTest.idtransaction);
      expect(transaction.props.idaccount).to.equal(dataEntryTest.idaccount);
      expect(transaction.props.idparent).to.equal(dataEntryTest.idparent);
      expect(transaction.props.idstatus).to.equal(dataEntryTest.idstatus);
      expect(transaction.props.description).to.equal(dataEntryTest.description);
      expect(transaction.props.instalment).to.equal(dataEntryTest.instalment);
      expect(transaction.props.amount).to.equal(dataEntryTest.amount);
      expect(transaction.props.type).to.equal(dataEntryTest.type);
      expect(transaction.props.startdate).to.equal(dataEntryTest.startdate);
      expect(transaction.props.duedate).to.equal(dataEntryTest.duedate);
      expect(transaction.props.tag).to.equal(dataEntryTest.tag);
      expect(transaction.props.origin).to.equal(dataEntryTest.origin);
    });
  });

  describe('#setProperties()', () => {
    it('should set properties for instance', () => {
      const transaction = new Transaction();
      transaction.setProperties(dataEntryTest);
      expect(transaction.props.iduser).to.equal(dataEntryTest.iduser);
      expect(transaction.props.idtransaction).to.equal(dataEntryTest.idtransaction);
      expect(transaction.props.idaccount).to.equal(dataEntryTest.idaccount);
      expect(transaction.props.idparent).to.equal(dataEntryTest.idparent);
      expect(transaction.props.idstatus).to.equal(dataEntryTest.idstatus);
      expect(transaction.props.description).to.equal(dataEntryTest.description);
      expect(transaction.props.instalment).to.equal(dataEntryTest.instalment);
      expect(transaction.props.amount).to.equal(dataEntryTest.amount);
      expect(transaction.props.type).to.equal(dataEntryTest.type);
      expect(transaction.props.startdate).to.equal(dataEntryTest.startdate);
      expect(transaction.props.duedate).to.equal(dataEntryTest.duedate);
      expect(transaction.props.tag).to.equal(dataEntryTest.tag);
      expect(transaction.props.origin).to.equal(dataEntryTest.origin);
    });
  });

  describe('#getProperties()', () => {
    it('should get properties from instance', () => {
      const transaction = new Transaction(dataEntryTest);
      const data = transaction.getProperties();
      expect(data.iduser).to.equal(dataEntryTest.iduser);
      expect(data.idtransaction).to.equal(dataEntryTest.idtransaction);
      expect(data.idaccount).to.equal(dataEntryTest.idaccount);
      expect(data.idparent).to.equal(dataEntryTest.idparent);
      expect(data.idstatus).to.equal(dataEntryTest.idstatus);
      expect(data.description).to.equal(dataEntryTest.description);
      expect(data.instalment).to.equal(dataEntryTest.instalment);
      expect(data.amount).to.equal(dataEntryTest.amount);
      expect(data.type).to.equal(dataEntryTest.type);
      expect(data.startdate).to.equal(dataEntryTest.startdate);
      expect(data.duedate).to.equal(dataEntryTest.duedate);
      expect(data.tag).to.equal(dataEntryTest.tag);
      expect(data.origin).to.equal(dataEntryTest.origin);
    });

    it('should change data from #getProperties() and does not affect instance', () => {
      const transaction = new Transaction(dataEntryTest);
      const data = transaction.getProperties();
      data.description = faker.lorem.words();
      expect(transaction.props.description).to.equal(dataEntryTest.description)
        .and.not.equal(data.description);
    });
  });

  describe('#getAll()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'find').returns(dbMock);
      this._transaction = new Transaction();
    });

    afterEach(() => {
      sandbox.restore();
      this._transaction = null;
    });

    it('should return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._transaction.getAll(dataEntryTest.iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Array)
        .and.to.have.lengthOf(1)
        .and.to.have.nested.property('[0].idtransaction', dataEntryTest.idtransaction);
    });

    it('should return no entries, empty array, from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._transaction.getAll(dataEntryTest.iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Array)
        .and.to.have.lengthOf(0);
    });

    it('should fail to return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._transaction.getAll(dataEntryTest.iduser)).to.eventually.be.rejectedWith(Error)
        .and.to.not.have.property('status');
    });
  });

  describe('#findByID()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOne').returns(dbMock);
      this._transaction = new Transaction();
    });

    afterEach(() => {
      sandbox.restore();
      this._transaction = null;
    });

    it('should find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._transaction.findById(dataEntryTest.iduser, dataEntryTest.idtransaction)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Transaction)
        .and.to.have.nested.property('props.idtransaction', dataEntryTest.idtransaction);
    });

    it('should NOT find any entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._transaction.findById(dataEntryTest.iduser, dataEntryTest.idtransaction)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });

    it('should fail to find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._transaction.findById(dataEntryTest.iduser, dataEntryTest.idtransaction)).to.eventually.be.rejectedWith(Error)
        .and.to.not.have.property('status');
    });
  });

  describe('#findByPeriod()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'find').returns(dbMock);
      this._transaction = new Transaction();
    });

    afterEach(() => {
      sandbox.restore();
      this._transaction = null;
    });

    it('should find all entries into DB by a given period', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      const year = 2000;
      const month = 10;
      return expect(this._transaction.findByPeriod(dataEntryTest.iduser, year, month)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Array)
        .and.to.have.lengthOf(1)
        .and.to.have.nested.property('[0].idtransaction', dataEntryTest.idtransaction);
    });

    it('should return no entries, empty array, from DB by a given period', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      const year = 2000;
      const month = 10;
      return expect(this._transaction.findByPeriod(dataEntryTest.iduser, year, month)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Array)
        .and.to.have.lengthOf(0);
    });

    it('should fail to return all entries from DB by a given period', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      const year = 2000;
      const month = 10;
      return expect(this._transaction.findByPeriod(dataEntryTest.iduser, year, month)).to.eventually.be.rejectedWith(Error)
        .and.to.not.have.property('status');
    });
  });

  describe('#findOverdue()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'find').returns(dbMock);
      this._transaction = new Transaction();
    });

    afterEach(() => {
      sandbox.restore();
      this._transaction = null;
    });

    it('should find all entries into DB by a given period', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._transaction.findOverdue(dataEntryTest.iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Array)
        .and.to.have.lengthOf(1)
        .and.to.have.nested.property('[0].idtransaction', dataEntryTest.idtransaction);
    });

    it('should return no entries, empty array, from DB by a given period', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._transaction.findOverdue(dataEntryTest.iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Array)
        .and.to.have.lengthOf(0);
    });

    it('should fail to return all entries from DB by a given period', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._transaction.findOverdue(dataEntryTest.iduser)).to.eventually.be.rejectedWith(Error)
        .and.to.not.have.property('status');
    });
  });

  describe('#create()', () => {
    beforeEach(() => {
      this._transaction = new Transaction(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._transaction = null;
    });

    it('should create a new entry into DB', () => {
      sandbox.stub(db, 'create').resolves(dbEntryReturn);
      return expect(this._transaction.create()).to.eventually.be.fulfilled;
    });

    it('should fail when create an entry into DB', () => {
      sandbox.stub(db, 'create').rejects(dbError);
      return expect(this._transaction.create()).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#createBatch()', () => {
    beforeEach(() => {
      this._transaction = new Transaction(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._transaction = null;
    });

    it('should create an entry into DB', () => {
      sandbox.stub(db, 'insertMany').resolves(dbEntryReturn);
      const payload = [Object.assign({}, dataEntryDbTest)];
      payload[0].idtransaction = faker.random.number();
      return expect(this._transaction.createBatch(dataEntryDbTest.iduser, payload)).to.eventually.be.fulfilled;
    });

    it('should create a 2 entries into DB', () => {
      sandbox.stub(db, 'insertMany').resolves(dbEntryReturn);
      const payload = [];
      const dataEntryDbTest2 = Object.assign({}, dataEntryDbTest);
      dataEntryDbTest2.idparent = dataEntryDbTest.idtransaction;
      dataEntryDbTest2.idtransaction = faker.random.number();
      payload.push(dataEntryDbTest);
      payload.push(dataEntryDbTest2);
      return expect(this._transaction.createBatch(dataEntryDbTest.iduser, payload)).to.eventually.be.fulfilled;
    });

    it('should fail when create 2 entries into DB', () => {
      sandbox.stub(db, 'insertMany').rejects(dbError);
      const payload = [];
      const dataEntryDbTest2 = Object.assign({}, dataEntryDbTest);
      dataEntryDbTest2.idparent = dataEntryDbTest.idtransaction;
      dataEntryDbTest2.idtransaction = faker.random.number();
      payload.push([dataEntryDbTest]);
      payload.push([dataEntryDbTest2]);
      return expect(this._transaction.createBatch(dataEntryDbTest.iduser, payload)).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#update()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      this._transaction = new Transaction(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._transaction = null;
    });

    it('should update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      this._transaction.props.description = 'TEST';
      return expect(this._transaction.update()).to.eventually.be.fulfilled;
    });

    it('should NOT find any entry to update into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._transaction.update()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._transaction.update()).to.eventually.be.rejectedWith(Error)
        .and.to.not.have.property('status');
    });
  });

  describe('#delete()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOneAndDelete').returns(dbMock);
      this._transaction = new Transaction(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._transaction = null;
    });

    it('should delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._transaction.delete()).to.eventually.be.fulfilled;
    });

    it('should NOT find any entry to delete from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._transaction.delete()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });

    it('should fail when delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._transaction.delete()).to.eventually.be.rejectedWith(Error)
        .and.to.not.have.property('status');
    });
  });
});
