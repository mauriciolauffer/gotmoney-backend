'use strict';

const faker = require('faker');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/category');
const Category = require('../../../controllers/category');
const Helper = require('../../helper/helper');
const expect = chai.expect;
const sandbox = sinon.createSandbox();
const dbMock = Helper.getMongoDbModelMock();
const dbError = new Error();
const dataEntryTest = Helper.getFakeCategory();
const dbEntryReturn = [dataEntryTest];

chai.use(chaiAsPromised);

describe('Category', () => {
  describe('#contructor', () => {
    it('should get a new instance', () => {
      expect(new Category()).to.be.instanceOf(Object);
    });

    it('should get a new instance and set properties', () => {
      const category = new Category(dataEntryTest);
      expect(category).to.have.property('props');
      expect(category.props.iduser).to.equal(dataEntryTest.iduser);
      expect(category.props.idcategory).to.equal(dataEntryTest.idcategory);
      expect(category.props.description).to.equal(dataEntryTest.description);
      expect(category.props.budget).to.equal(dataEntryTest.budget);
    });
  });

  describe('#setProperties()', () => {
    it('should set properties for instance', () => {
      const category = new Category();
      category.setProperties(dataEntryTest);
      expect(category.props.iduser).to.equal(dataEntryTest.iduser);
      expect(category.props.idcategory).to.equal(dataEntryTest.idcategory);
      expect(category.props.description).to.equal(dataEntryTest.description);
      expect(category.props.budget).to.equal(dataEntryTest.budget);
    });
  });

  describe('#getProperties()', () => {
    it('should get properties from instance', () => {
      const category = new Category(dataEntryTest);
      const data = category.getProperties();
      expect(data.iduser).to.equal(dataEntryTest.iduser);
      expect(data.idcategory).to.equal(dataEntryTest.idcategory);
      expect(data.description).to.equal(dataEntryTest.description);
      expect(data.budget).to.equal(dataEntryTest.budget);
    });

    it('should change data from #getProperties() and does not affect instance', () => {
      const category = new Category(dataEntryTest);
      const data = category.getProperties();
      data.idcategory = faker.random.number();
      expect(category.props.idcategory).to.equal(dataEntryTest.idcategory)
          .and.not.equal(data.idcategory);
    });
  });

  describe('#getAll()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'find').returns(dbMock);
      this._category = new Category();
    });

    afterEach(() => {
      sandbox.restore();
      this._category = null;
    });

    it('should return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._category.getAll(dataEntryTest.iduser)).to.eventually.be.fulfilled
          .and.to.be.instanceOf(Array)
          .and.to.have.lengthOf(1)
          .and.to.have.nested.property('[0].idcategory', dataEntryTest.idcategory);
    });

    it('should return no entries, empty array, from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._category.getAll(dataEntryTest.iduser)).to.eventually.be.fulfilled
          .and.to.be.instanceOf(Array)
          .and.to.have.lengthOf(0);
    });

    it('should fail to return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._category.getAll(dataEntryTest.iduser)).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });

  describe('#findByID()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOne').returns(dbMock);
      this._category = new Category();
    });

    afterEach(() => {
      sandbox.restore();
      this._category = null;
    });

    it('should find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._category.findById(dataEntryTest.iduser, dataEntryTest.idcategory)).to.eventually.be.fulfilled
          .and.to.be.instanceOf(Category)
          .and.to.have.nested.property('props.idcategory', dataEntryTest.idcategory);
    });

    it('should NOT find any entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._category.findById(dataEntryTest.iduser, dataEntryTest.idcategory)).to.eventually.be.rejectedWith(Error)
          .and.to.have.property('status', 404);
    });

    it('should fail to find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._category.findById(dataEntryTest.iduser, dataEntryTest.idcategory)).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });

  describe('#create()', () => {
    beforeEach(() => {
      this._category = new Category(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._category = null;
    });

    it('should create a new entry into DB', () => {
      sandbox.stub(db, 'create').resolves(dbEntryReturn);
      return expect(this._category.create()).to.eventually.be.fulfilled;
    });

    it('should fail when create a new entry into DB', () => {
      sandbox.stub(db, 'create').rejects(dbError);
      return expect(this._category.create()).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#update()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      this._category = new Category(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._category = null;
    });

    it('should update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      this._category.props.description = 'TEST';
      return expect(this._category.update()).to.eventually.be.fulfilled;
    });

    it('should NOT find any entry to update into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._category.update()).to.eventually.be.rejectedWith(Error)
          .and.to.have.property('status', 404);
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._category.update()).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });

  describe('#delete()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOneAndDelete').returns(dbMock);
      this._category = new Category(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._category = null;
    });

    it('should delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._category.delete()).to.eventually.be.fulfilled;
    });

    it('should NOT find any entry to delete from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._category.delete()).to.eventually.be.rejectedWith(Error)
          .and.to.have.property('status', 404);
    });

    it('should fail when delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._category.delete()).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });
});
