'use strict';

const faker = require('faker');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/transaction');
const Transaction = require('../../../controllers/transaction');
const Helper = require('../../helper/helper');
const CustomErrors = require('../../../utils/errors');
const expect = chai.expect;
const sandbox = sinon.createSandbox();
const dbMock = Helper.getMongoDbModelMock();
const dbError = CustomErrors.HTTP.get404();
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
    afterEach(() => {
      sandbox.restore();
    });

    it('should return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'find').returns(dbMock);
      const iduser = faker.random.number();
      const transaction = new Transaction();
      return expect(transaction.getAll(iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('[0].idtransaction', dataEntryTest.idtransaction);
    });

    it('should fail to return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'find').returns(dbMock);
      const iduser = 'A';
      const transaction = new Transaction();
      return expect(transaction.getAll(iduser)).to.eventually.be.rejectedWith(Error)
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
      const iduser = faker.random.number();
      const idtransaction = faker.random.number();
      const transaction = new Transaction();
      return expect(transaction.findById(iduser, idtransaction)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('props.idtransaction', dataEntryTest.idtransaction);
    });

    it('should fail to find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const iduser = 'A';
      const idtransaction = 'B';
      const transaction = new Transaction();
      return expect(transaction.findById(iduser, idtransaction)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#findByPeriod()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should find all entries into DB by a given period', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'find').returns(dbMock);
      const iduser = faker.random.number();
      const year = 2000;
      const month = 10;
      const transaction = new Transaction();
      return expect(transaction.findByPeriod(iduser, year, month)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('[0].idtransaction', dataEntryTest.idtransaction);
    });

    it('should find all entries into DB by a given period', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'find').returns(dbMock);
      const iduser = 'A';
      const year = 2000;
      const month = 9;
      const transaction = new Transaction();
      return expect(transaction.findByPeriod(iduser, year, month)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#findOverdue()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should find all overdue entries into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'find').returns(dbMock);
      const iduser = faker.random.number();
      const transaction = new Transaction();
      return expect(transaction.findOverdue(iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('[0].idtransaction', dataEntryTest.idtransaction);
    });

    it('should fail to find all overdue entries into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'find').returns(dbMock);
      const iduser = 'A';
      const transaction = new Transaction();
      return expect(transaction.findOverdue(iduser)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#create()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should create a new entry into DB', () => {
      sandbox.stub(db, 'create').resolves(dbEntryReturn);
      const transaction = new Transaction(dataEntryDbTest);
      return expect(transaction.create()).to.eventually.be.fulfilled;
    });

    it('should fail when create an entry into DB', () => {
      sandbox.stub(db, 'create').rejects(dbError);
      const transaction = new Transaction(dataEntryTest);
      return expect(transaction.create()).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#createBatch()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should create an entry into DB', () => {
      sandbox.stub(db, 'insertMany').resolves(dbEntryReturn);
      const payload = [Object.assign({}, dataEntryDbTest)];
      payload[0].idtransaction = faker.random.number();
      const transaction = new Transaction();
      return expect(transaction.createBatch(dataEntryDbTest.iduser, payload)).to.eventually.be.fulfilled;
    });

    it('should create a 2 entries into DB', () => {
      sandbox.stub(db, 'insertMany').resolves(dbEntryReturn);
      const payload = [];
      const dataEntryDbTest2 = Object.assign({}, dataEntryDbTest);
      dataEntryDbTest2.idparent = dataEntryDbTest.idtransaction;
      dataEntryDbTest2.idtransaction = faker.random.number();
      payload.push(dataEntryDbTest);
      payload.push(dataEntryDbTest2);
      const transaction = new Transaction();
      return expect(transaction.createBatch(dataEntryDbTest.iduser, payload)).to.eventually.be.fulfilled;
    });

    it('should fail when create 2 entries into DB', () => {
      sandbox.stub(db, 'insertMany').rejects(dbError);
      const payload = [];
      const dataEntryDbTest2 = Object.assign({}, dataEntryDbTest);
      dataEntryDbTest2.idparent = dataEntryDbTest.idtransaction;
      dataEntryDbTest2.idtransaction = faker.random.number();
      payload.push([dataEntryDbTest]);
      payload.push([dataEntryDbTest2]);
      const transaction = new Transaction();
      return expect(transaction.createBatch(dataEntryDbTest.iduser, payload)).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#update()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const transaction = new Transaction(dataEntryDbTest);
      transaction.props.description = 'TEST';
      return expect(transaction.update()).to.eventually.be.fulfilled;
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const transaction = new Transaction({
        iduser: 'A',
        idtransaction: 'B'
      });
      return expect(transaction.update()).to.eventually.be.rejectedWith(Error)
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
      const transaction = new Transaction(dataEntryDbTest);
      return expect(transaction.delete()).to.eventually.be.fulfilled;
    });

    it('should fail when delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOneAndDelete').returns(dbMock);
      const transaction = new Transaction({
        iduser: 'A',
        idtransaction: 'B'
      });
      return expect(transaction.delete()).to.eventually.be.rejectedWith(Error);
    });
  });
});
