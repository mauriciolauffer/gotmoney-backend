'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/database');
const Category = require('../../../controllers/category');
const expect = chai.expect;
const sandbox = sinon.sandbox.create();
const dataEntryTest = {
  iduser: 1,
  idcategory: 2,
  description: 3,
  lastchange: 4
};
const dbEntryReturn = [dataEntryTest];
const dbError = new Error('Test error');
dbError.status = 404;

chai.use(chaiAsPromised);

describe('Category', () => {
  describe('#contructor', () => {
    it('should get a new instance', () => {
      expect(new Category()).to.be.instanceOf(Object);
    });

    it('should get a new instance and set properties', () => {
      const category = new Category(dataEntryTest);
      expect(category).to.have.property('props');
      expect(category.props.iduser).to.equal(1);
      expect(category.props.idcategory).to.equal(2);
      expect(category.props.description).to.equal(3);
      expect(category.props.lastchange).to.equal(4);
    });
  });

  describe('#setProperties()', () => {
    it('should set properties for instance', () => {
      const category = new Category();
      category.setProperties(dataEntryTest);
      expect(category.props.iduser).to.equal(1);
      expect(category.props.idcategory).to.equal(2);
      expect(category.props.description).to.equal(3);
      expect(category.props.lastchange).to.equal(4);
    });
  });

  describe('#getProperties()', () => {
    it('should get properties from instance', () => {
      const category = new Category(dataEntryTest);
      const data = category.getProperties();
      expect(data.iduser).to.equal(1);
      expect(data.idcategory).to.equal(2);
      expect(data.description).to.equal(3);
      expect(data.lastchange).to.equal(4);
    });

    it('should change data from #getProperties() and does not affect instance', () => {
      const category = new Category(dataEntryTest);
      const data = category.getProperties();
      data.idcategory = 25;
      expect(category.props.idcategory).to.equal(2)
        .and.not.equal(data.idcategory);
    });
  });

  describe('#getAll()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should return all entries from DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const category = new Category();
      return expect(category.getAll(dataEntryTest.iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('[0].idcategory', 2);
    });

    it('should fail to return all entries from DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const iduser = 'A';
      const category = new Category();
      return expect(category.getAll(iduser)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#findByID()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should find an entry into DB by ID', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const category = new Category();
      return expect(category.findById(dataEntryTest.iduser, dataEntryTest.idcategory)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('props.idcategory', 2);
    });

    it('should fail to find an entry into DB by ID', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const iduser = 'A';
      const idcategory = 'B';
      const category = new Category();
      return expect(category.findById(iduser, idcategory)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#create()', () => {
    /*after((done) => {
      const category = new Category(dataEntryTest);
      category.delete()
        .then(() => done())
        .catch((err) => done(err));
    });*/

    afterEach(() => {
      sandbox.restore();
    });

    it('should create a new entry into DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const category = new Category(dataEntryTest);
      return expect(category.create()).to.eventually.be.fulfilled;
    });

    it('should fail when create a new entry into DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const category = new Category(dataEntryTest);
      return expect(category.create()).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#update()', () => {
    /*before((done) => {
      const category = new Category(dataEntryTest);
      category.create()
        .then(() => done())
        .catch((err) => done(err));
    });

    after((done) => {
      const category = new Category(dataEntryTest);
      category.delete()
        .then(() => done())
        .catch((err) => done(err));
    });*/

    afterEach(() => {
      sandbox.restore();
    });

    it('should update an entry into DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const category = new Category(dataEntryTest);
      category.props.description = 'TEST';
      return expect(category.update()).to.eventually.be.fulfilled;
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const category = new Category({
        iduser: 'A',
        idcategory: 'B'
      });
      return expect(category.update()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#delete()', () => {
    /*before((done) => {
      const category = new Category(dataEntryTest);
      category.create()
        .then(() => done())
        .catch((err) => done(err));
    });*/

    afterEach(() => {
      sandbox.restore();
    });

    it('should delete an entry from DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const category = new Category(dataEntryTest);
      return expect(category.delete()).to.eventually.be.fulfilled;
    });

    it('should fail when delete an entry from DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const category = new Category({
        idcategory: 'A',
        iduser: 'B'
      });
      return expect(category.delete()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });
});
