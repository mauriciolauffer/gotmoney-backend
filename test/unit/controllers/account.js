'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/database');
const Account = require('../../../controllers/account');
const sandbox = sinon.sandbox.create();
const expect = chai.expect;
const dataEntryTest = {
  iduser: 1,
  idaccount: 2,
  idtype: 3,
  description: 4,
  creditlimit: 5,
  balance: 6,
  openingdate: 7,
  duedate: 8,
  lastchange: 9
};
const dbEntryReturn = [dataEntryTest];
const dbError = new Error('Test error');
dbError.status = 404;

chai.use(chaiAsPromised);

describe('Account', () => {
  describe('#contructor', () => {
    it('should get a new instance', () => {
      expect(new Account()).to.be.instanceOf(Object);
    });

    it('should get a new instance and set properties', () => {
      const account = new Account(dataEntryTest);
      expect(account).to.have.property('props');
      expect(account.props.iduser).to.equal(1);
      expect(account.props.idaccount).to.equal(2);
      expect(account.props.idtype).to.equal(3);
      expect(account.props.description).to.equal(4);
      expect(account.props.creditlimit).to.equal(5);
      expect(account.props.balance).to.equal(6);
      expect(account.props.openingdate).to.equal(7);
      expect(account.props.duedate).to.equal(8);
      expect(account.props.lastchange).to.equal(9);
    });
  });

  describe('#setProperties()', () => {
    it('should set properties for instance', () => {
      const account = new Account();
      account.setProperties(dataEntryTest);
      expect(account.props.iduser).to.equal(1);
      expect(account.props.idaccount).to.equal(2);
      expect(account.props.idtype).to.equal(3);
      expect(account.props.description).to.equal(4);
      expect(account.props.creditlimit).to.equal(5);
      expect(account.props.balance).to.equal(6);
      expect(account.props.openingdate).to.equal(7);
      expect(account.props.duedate).to.equal(8);
      expect(account.props.lastchange).to.equal(9);
    });
  });

  describe('#getProperties()', () => {
    it('should get properties from instance', () => {
      const account = new Account(dataEntryTest);
      const data = account.getProperties();
      expect(data.iduser).to.equal(1);
      expect(data.idaccount).to.equal(2);
      expect(data.idtype).to.equal(3);
      expect(data.description).to.equal(4);
      expect(data.creditlimit).to.equal(5);
      expect(data.balance).to.equal(6);
      expect(data.openingdate).to.equal(7);
      expect(data.duedate).to.equal(8);
      expect(data.lastchange).to.equal(9);
    });

    it('should change data from #getProperties() and does not affect instance', () => {
      const account = new Account(dataEntryTest);
      const data = account.getProperties();
      data.idaccount = 25;
      expect(account.props.idaccount).to.equal(2)
        .and.not.equal(data.idaccount);
    });
  });

  describe('#getAll()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should return all entries from DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const account = new Account();
      return expect(account.getAll(dataEntryTest.iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        //.and.to.have.deep.property('[0].idaccount', 2);
        .and.to.have.nested.property('[0].idaccount', 2);
    });

    it('should fail to return all entries from DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
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
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const account = new Account();
      return expect(account.findById(dataEntryTest.iduser, dataEntryTest.idaccount)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('props.idaccount', 2);
    });

    it('should fail to find an entry into DB by ID', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const iduser = 'A';
      const idaccount = 'B';
      const account = new Account();
      return expect(account.findById(iduser, idaccount)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#create()', () => {
    /*after((done) => {
      const account = new Account(dataEntryTest);
      account.delete()
        .then(() => done())
        .catch((err) => done(err));
    });*/

    afterEach(() => {
      sandbox.restore();
    });

    it('should create a new entry into DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const account = new Account(dataEntryTest);
      return expect(account.create()).to.eventually.be.fulfilled;
    });

    it('should fail when create a new entry into DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const account = new Account(dataEntryTest);
      return expect(account.create()).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#update()', () => {
    /*before((done) => {
      const account = new Account(dataEntryTest);
      account.create()
        .then(() => done())
        .catch((err) => done(err));
    });

    after((done) => {
      const account = new Account(dataEntryTest);
      account.delete()
        .then(() => done())
        .catch((err) => done(err));
    });*/

    afterEach(() => {
      sandbox.restore();
    });

    it('should update an entry into DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const account = new Account(dataEntryTest);
      account.props.description = 'TEST';
      return expect(account.update()).to.eventually.be.fulfilled;
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const account = new Account({
        iduser: 'A',
        idaccount: 'B'
      });
      return expect(account.update()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#delete()', () => {
    /*before((done) => {
      const account = new Account(dataEntryTest);
      account.create()
        .then(() => done())
        .catch((err) => done(err));
    });*/

    afterEach(() => {
      sandbox.restore();
    });

    it('should delete an entry from DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const account = new Account(dataEntryTest);
      return expect(account.delete()).to.eventually.be.fulfilled;
    });

    it('should fail when delete an entry from DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const account = new Account({
        iduser: 'A',
        idaccount: 'B'
      });
      return expect(account.delete()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });
});
