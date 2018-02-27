'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/database');
const Transaction = require('../../../controllers/transaction');
const expect = chai.expect;
const sandbox = sinon.sandbox.create();
const dataEntryTest = {
  iduser: 1,
  idtransaction: 2,
  idaccount: 3,
  idparent: 4,
  idstatus: 5,
  description: 6,
  instalment: 7,
  amount: 8,
  type: 9,
  startdate: 10,
  duedate: 11,
  tag: 12,
  origin: 13,
  lastchange: 14
};
const dataEntryDbTest = {
  iduser: 1,
  idtransaction: 2,
  idaccount: 13639248531753,
  idparent: null,
  idstatus: 1,
  description: 6,
  instalment: 7,
  amount: 8,
  type: 'D',
  startdate: new Date(),
  duedate: new Date(),
  tag: 12,
  origin: 13,
  lastchange: 14
};
const dbEntryReturn = [dataEntryTest];
const dbError = new Error('Test error');
dbError.status = 404;

chai.use(chaiAsPromised);

describe('Transaction', () => {
  describe('#contructor', () => {
    it('should get a new instance', () => {
      expect(new Transaction()).to.be.instanceOf(Object);
    });

    it('should get a new instance and set properties', () => {
      const transaction = new Transaction(dataEntryTest);
      expect(transaction).to.have.property('props');
      expect(transaction.props.iduser).to.equal(1);
      expect(transaction.props.idtransaction).to.equal(2);
      expect(transaction.props.idaccount).to.equal(3);
      expect(transaction.props.idparent).to.equal(4);
      expect(transaction.props.idstatus).to.equal(5);
      expect(transaction.props.description).to.equal(6);
      expect(transaction.props.instalment).to.equal(7);
      expect(transaction.props.amount).to.equal(8);
      expect(transaction.props.type).to.equal(9);
      expect(transaction.props.startdate).to.equal(10);
      expect(transaction.props.duedate).to.equal(11);
      expect(transaction.props.tag).to.equal(12);
      expect(transaction.props.origin).to.equal(13);
      expect(transaction.props.lastchange).to.equal(14);
    });
  });

  describe('#setProperties()', () => {
    it('should set properties for instance', () => {
      const transaction = new Transaction();
      transaction.setProperties(dataEntryTest);
      expect(transaction.props.iduser).to.equal(1);
      expect(transaction.props.idtransaction).to.equal(2);
      expect(transaction.props.idaccount).to.equal(3);
      expect(transaction.props.idparent).to.equal(4);
      expect(transaction.props.idstatus).to.equal(5);
      expect(transaction.props.description).to.equal(6);
      expect(transaction.props.instalment).to.equal(7);
      expect(transaction.props.amount).to.equal(8);
      expect(transaction.props.type).to.equal(9);
      expect(transaction.props.startdate).to.equal(10);
      expect(transaction.props.duedate).to.equal(11);
      expect(transaction.props.tag).to.equal(12);
      expect(transaction.props.origin).to.equal(13);
      expect(transaction.props.lastchange).to.equal(14);
    });
  });

  describe('#getProperties()', () => {
    it('should get properties from instance', () => {
      const transaction = new Transaction(dataEntryTest);
      const data = transaction.getProperties();
      expect(data.iduser).to.equal(1);
      expect(data.idtransaction).to.equal(2);
      expect(data.idaccount).to.equal(3);
      expect(data.idparent).to.equal(4);
      expect(data.idstatus).to.equal(5);
      expect(data.description).to.equal(6);
      expect(data.instalment).to.equal(7);
      expect(data.amount).to.equal(8);
      expect(data.type).to.equal(9);
      expect(data.startdate).to.equal(10);
      expect(data.duedate).to.equal(11);
      expect(data.tag).to.equal(12);
      expect(data.origin).to.equal(13);
      expect(data.lastchange).to.equal(14);
    });

    it('should change data from #getProperties() and does not affect instance', () => {
      const transaction = new Transaction(dataEntryTest);
      const data = transaction.getProperties();
      data.description = 25;
      expect(transaction.props.description).to.equal(6)
        .and.not.equal(data.description);
    });
  });

  describe('#getAll()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should return all entries from DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const iduser = 3;
      const transaction = new Transaction();
      return expect(transaction.getAll(iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('[0].idtransaction', 2);
    });

    it('should fail to return all entries from DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
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
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const iduser = 3;
      const idtransaction = 138021454099;
      const transaction = new Transaction();
      return expect(transaction.findById(iduser, idtransaction)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('props.idtransaction', 2);
    });

    it('should fail to find an entry into DB by ID', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
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
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const iduser = 32;
      const year = 2000;
      const month = 10;
      const transaction = new Transaction();
      return expect(transaction.findByPeriod(iduser, year, month)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('[0].idtransaction', 2);
    });

    it('should find all entries into DB by a given period', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
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
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const iduser = 3;
      const transaction = new Transaction();
      return expect(transaction.findOverdue(iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('[0].idtransaction', 2);
    });

    it('should fail to find all overdue entries into DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const iduser = 'A';
      const transaction = new Transaction();
      return expect(transaction.findOverdue(iduser)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#create()', () => {
    /*after((done) => {
     const transaction = new Transaction(dataEntryDbTest);
     transaction.delete()
     .then(() => done())
     .catch((err) => done(err));
     });*/
    afterEach(() => {
      sandbox.restore();
    });

    it('should create a new entry into DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const transaction = new Transaction(dataEntryDbTest);
      return expect(transaction.create()).to.eventually.be.fulfilled;
    });

    it('should fail when create an entry into DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const transaction = new Transaction(dataEntryTest);
      return expect(transaction.create()).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#createBatch()', () => {
    /*after((done) => {
     const transaction = new Transaction(dataEntryDbTest);
     const transaction2 = new Transaction(dataEntryDbTest);
     const transaction3 = new Transaction(dataEntryDbTest);
     transaction2.props.idtransaction = 1;
     transaction3.props.idtransaction = 3;
     Promise.all([transaction.delete(), transaction2.delete(), transaction3.delete()])
     .then(() => done())
     .catch((err) => done(err));
     });*/

    afterEach(() => {
      sandbox.restore();
    });

    it('should create an entry into DB', () => {
      sandbox.stub(db, 'queryPromise').resolves(dbEntryReturn);
      const payload = [Object.assign({}, dataEntryDbTest)];
      payload[0].idtransaction = 3;
      const transaction = new Transaction();
      return expect(transaction.createBatch(dataEntryDbTest.iduser, payload)).to.eventually.be.fulfilled;
    });

    it('should create a 2 entries into DB', () => {
      sandbox.stub(db, 'queryPromise').resolves(dbEntryReturn);
      const payload = [];
      const dataEntryDbTest2 = Object.assign({}, dataEntryDbTest);
      dataEntryDbTest2.idparent = dataEntryDbTest.idtransaction;
      dataEntryDbTest2.idtransaction = 1;
      payload.push(dataEntryDbTest);
      payload.push(dataEntryDbTest2);
      const transaction = new Transaction();
      return expect(transaction.createBatch(dataEntryDbTest.iduser, payload)).to.eventually.be.fulfilled;
    });

    it('should fail when create 2 entries into DB', () => {
      sandbox.stub(db, 'queryPromise').rejects(dbError);
      const payload = [];
      const dataEntryDbTest2 = Object.assign({}, dataEntryDbTest);
      dataEntryDbTest2.idparent = dataEntryDbTest.idtransaction;
      dataEntryDbTest2.idtransaction = 1;
      payload.push([dataEntryDbTest]);
      payload.push([dataEntryDbTest2]);
      const transaction = new Transaction();
      return expect(transaction.createBatch(dataEntryDbTest.iduser, payload)).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#update()', () => {
    /*before((done) => {
     const transaction = new Transaction(dataEntryDbTest);
     transaction.create()
     .then(() => done())
     .catch((err) => done(err));
     });

     after((done) => {
     const transaction = new Transaction(dataEntryDbTest);
     transaction.delete()
     .then(() => done())
     .catch((err) => done(err));
     });*/

    afterEach(() => {
      sandbox.restore();
    });

    it('should update an entry into DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const transaction = new Transaction(dataEntryDbTest);
      transaction.props.description = 'TEST';
      return expect(transaction.update()).to.eventually.be.fulfilled;
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const transaction = new Transaction({
        iduser: 'A',
        idtransaction: 'B'
      });
      return expect(transaction.update()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#delete()', () => {
    /*before((done) => {
     const transaction = new Transaction(dataEntryDbTest);
     transaction.create()
     .then(() => done())
     .catch((err) => done(err));
     });*/

    afterEach(() => {
      sandbox.restore();
    });

    it('should delete an entry from DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const transaction = new Transaction(dataEntryDbTest);
      return expect(transaction.delete()).to.eventually.be.fulfilled;
    });

    it('should fail when delete an entry from DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const transaction = new Transaction({
        iduser: 'A',
        idtransaction: 'B'
      });
      return expect(transaction.delete()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });
});
