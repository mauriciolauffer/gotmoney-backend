'use strict';

const faker = require('faker');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/category');
const Category = require('../../../controllers/category');
const Helper = require('../../helper/helper');
const CustomErrors = require('../../../utils/errors');
const expect = chai.expect;
const sandbox = sinon.createSandbox();
const dbMock = Helper.getMongoDbModelMock();
const dbError = CustomErrors.HTTP.get404();
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
    });
  });

  describe('#setProperties()', () => {
    it('should set properties for instance', () => {
      const category = new Category();
      category.setProperties(dataEntryTest);
      expect(category.props.iduser).to.equal(dataEntryTest.iduser);
      expect(category.props.idcategory).to.equal(dataEntryTest.idcategory);
      expect(category.props.description).to.equal(dataEntryTest.description);
    });
  });

  describe('#getProperties()', () => {
    it('should get properties from instance', () => {
      const category = new Category(dataEntryTest);
      const data = category.getProperties();
      expect(data.iduser).to.equal(dataEntryTest.iduser);
      expect(data.idcategory).to.equal(dataEntryTest.idcategory);
      expect(data.description).to.equal(dataEntryTest.description);
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
    afterEach(() => {
      sandbox.restore();
    });

    it('should return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'find').returns(dbMock);
      const category = new Category();
      return expect(category.getAll(dataEntryTest.iduser)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('[0].idcategory', dataEntryTest.idcategory);
    });

    it('should fail to return all entries from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'find').returns(dbMock);
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
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const category = new Category();
      return expect(category.findById(dataEntryTest.iduser, dataEntryTest.idcategory)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object)
        .and.to.have.nested.property('props.idcategory', dataEntryTest.idcategory);
    });

    it('should fail to find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const iduser = 'A';
      const idcategory = 'B';
      const category = new Category();
      return expect(category.findById(iduser, idcategory)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#create()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should create a new entry into DB', () => {
      sandbox.stub(db, 'create').resolves(dbEntryReturn);
      const category = new Category(dataEntryTest);
      return expect(category.create()).to.eventually.be.fulfilled;
    });

    it('should fail when create a new entry into DB', () => {
      sandbox.stub(db, 'create').rejects(dbError);
      const category = new Category(dataEntryTest);
      return expect(category.create()).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#update()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const category = new Category(dataEntryTest);
      category.props.description = 'TEST';
      return expect(category.update()).to.eventually.be.fulfilled;
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const category = new Category({
        iduser: 'A',
        idcategory: 'B'
      });
      return expect(category.update()).to.eventually.be.rejectedWith(Error)
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
      const category = new Category(dataEntryTest);
      return expect(category.delete()).to.eventually.be.fulfilled;
    });

    it('should fail when delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOneAndDelete').returns(dbMock);
      const category = new Category({
        idcategory: 'A',
        iduser: 'B'
      });
      return expect(category.delete()).to.eventually.be.rejectedWith(Error);
    });
  });
});
