'use strict';

const faker = require('faker');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const db = require('../../../models/user');
const User = require('../../../controllers/user');
const Helper = require('../../helper/helper');
const expect = chai.expect;
const sandbox = sinon.createSandbox();
const dbMock = Helper.getMongoDbModelMock();
const dbError = new Error();
const dataEntryTest = Helper.getFakeUser();
const dbEntryReturn = [dataEntryTest];

chai.use(chaiAsPromised);

describe('User', () => {
  describe('#contructor', () => {
    it('should get a new instance', () => {
      expect(new User()).to.be.an('object');
    });

    it('should get a new instance and set properties', () => {
      const user = new User(dataEntryTest);
      expect(user).to.have.property('props');
      expect(user.props.iduser).to.equal(dataEntryTest.iduser);
      expect(user.props.name).to.equal(dataEntryTest.name);
      expect(user.props.email).to.equal(dataEntryTest.email);
      expect(user.props.createdon).to.equal(dataEntryTest.createdon);
      expect(user.props.passwd).to.equal(dataEntryTest.passwd);
      expect(user.props.alert).to.equal(dataEntryTest.alert);
      expect(user.props.active).to.equal(dataEntryTest.active);
      expect(user.props.facebook).to.equal(dataEntryTest.facebook);
      expect(user.props.google).to.equal(dataEntryTest.google);
      expect(user.props.twitter).to.equal(dataEntryTest.twitter);
    });
  });

  describe('#setProperties()', () => {
    it('should set properties for instance', () => {
      const user = new User();
      user.setProperties(dataEntryTest);
      expect(user.props.iduser).to.equal(dataEntryTest.iduser);
      expect(user.props.name).to.equal(dataEntryTest.name);
      expect(user.props.email).to.equal(dataEntryTest.email);
      expect(user.props.createdon).to.equal(dataEntryTest.createdon);
      expect(user.props.passwd).to.equal(dataEntryTest.passwd);
      expect(user.props.alert).to.equal(dataEntryTest.alert);
      expect(user.props.active).to.equal(dataEntryTest.active);
      expect(user.props.facebook).to.equal(dataEntryTest.facebook);
      expect(user.props.google).to.equal(dataEntryTest.google);
      expect(user.props.twitter).to.equal(dataEntryTest.twitter);
    });
  });

  describe('#getProperties()', () => {
    it('should get properties from instance', () => {
      const user = new User(dataEntryTest);
      const data = user.getProperties();
      expect(data.iduser).to.equal(dataEntryTest.iduser);
      expect(data.name).to.equal(dataEntryTest.name);
      expect(data.email).to.equal(dataEntryTest.email);
      expect(data.createdon).to.equal(dataEntryTest.createdon);
      expect(data.passwd).to.not.exist;
      expect(data.alert).to.equal(dataEntryTest.alert);
      expect(data.active).to.equal(dataEntryTest.active);
      expect(data.facebook).to.equal(dataEntryTest.facebook);
      expect(data.google).to.equal(dataEntryTest.google);
      expect(data.twitter).to.equal(dataEntryTest.twitter);
    });

    it('should change data from #getProperties() and does not affect instance', () => {
      const user = new User(dataEntryTest);
      const data = user.getProperties();
      data.name = faker.name.findName();
      expect(user.props.name).to.equal(dataEntryTest.name)
          .and.not.equal(data.name);
    });
  });

  describe('#hashPassword()', () => {
    after(() => {
      sandbox.restore();
    });

    it('should create a hash from a given password', () => {
      const user = new User();
      return expect(user.hashPassword(dataEntryTest.passwd)).to.eventually.be.fulfilled
          .and.to.be.a('string');
    });

    it('should fail when create a hash from a given password', () => {
      sandbox.stub(bcrypt, 'hash').rejects(dbError);
      const user = new User();
      return expect(user.hashPassword(null)).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#verifyPassword()', () => {
    let passwordHash;

    before((done) => {
      const user = new User();
      user.hashPassword(dataEntryTest.passwd)
          .then((hash) => {
            passwordHash = hash;
            return done();
          })
          .catch((err) => done(err));
    });

    after(() => {
      sandbox.restore();
    });

    it('should compare password to hash', () => {
      const user = new User();
      user.props.passwd = passwordHash;
      return expect(user.verifyPassword(dataEntryTest.passwd)).to.eventually.be.fulfilled;
    });

    it('should fail when compare password to hash', () => {
      const user = new User();
      const password = dataEntryTest.passwd + Date.now();
      user.props.passwd = passwordHash;
      return expect(user.verifyPassword(password)).to.eventually.be.rejectedWith(Error);
    });

    it('should fail for error when compare password to hash', () => {
      sandbox.stub(bcrypt, 'compare').rejects(dbError);
      const user = new User();
      return expect(user.verifyPassword(null)).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#setId()', () => {
    it('should generate an ID', () => {
      const user = new User();
      user.setId();
      return expect(user.props.iduser).to.exist.and.to.be.a('number');
    });
  });

  describe('#setAutoPassword()', () => {
    it('should generate an password', () => {
      const user = new User();
      user.setAutoPassword();
      return expect(user.props.passwd).to.exist.and.to.be.an('string');
    });
  });

  describe('#findByID()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOne').returns(dbMock);
      this._user = new User();
    });

    afterEach(() => {
      sandbox.restore();
      this._user = null;
    });

    it('should find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn[0]);
      return expect(this._user.findById(dataEntryTest.iduser)).to.eventually.be.fulfilled
          .and.to.be.instanceOf(User)
          .and.to.have.nested.property('props.iduser', dataEntryTest.iduser);
    });

    it('should NOT find any entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._user.findById(dataEntryTest.iduser)).to.eventually.be.rejectedWith(Error)
          .and.to.have.property('status', 404);
    });

    it('should fail to find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._user.findById(dataEntryTest.iduser)).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });

  describe('#findByEmail()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOne').returns(dbMock);
      this._user = new User();
    });

    afterEach(() => {
      sandbox.restore();
      this._user = null;
    });

    it('should find an entry into DB by email', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn[0]);
      return expect(this._user.findByEmail(dataEntryTest.email)).to.eventually.be.fulfilled
          .and.to.be.instanceOf(User)
          .and.to.have.nested.property('props.email', dataEntryTest.email);
    });

    it('should NOT find any entry into DB by email', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._user.findByEmail(dataEntryTest.email)).to.eventually.be.rejectedWith(Error)
          .and.to.have.property('status', 404);
    });

    it('should fail to find an entry into DB by email', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._user.findByEmail(dataEntryTest.email)).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });

  describe('#findByFacebook()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOne').returns(dbMock);
      this._user = new User();
    });

    afterEach(() => {
      sandbox.restore();
      this._user = null;
    });

    it('should find an entry into DB by facebook', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn[0]);
      return expect(this._user.findByFacebook(dataEntryTest.facebook)).to.eventually.be.fulfilled
          .and.to.be.instanceOf(User)
          .and.to.have.nested.property('props.facebook', dataEntryTest.facebook);
    });

    it('should NOT find any entry into DB by facebook', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._user.findByFacebook(dataEntryTest.facebook)).to.eventually.be.rejectedWith(Error)
          .and.to.have.property('status', 404);
    });

    it('should fail to find an entry into DB by facebook', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._user.findByFacebook(dataEntryTest.facebook)).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });

  describe('#findByGoogle()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOne').returns(dbMock);
      this._user = new User();
    });

    afterEach(() => {
      sandbox.restore();
      this._user = null;
    });

    it('should find an entry into DB by google', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn[0]);
      return expect(this._user.findByGoogle(dataEntryTest.google)).to.eventually.be.fulfilled
          .and.to.be.instanceOf(User)
          .and.to.have.nested.property('props.google', dataEntryTest.google);
    });

    it('should NOT find any entry into DB by google', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._user.findByGoogle(dataEntryTest.google)).to.eventually.be.rejectedWith(Error)
          .and.to.have.property('status', 404);
    });

    it('should fail to find an entry into DB by google', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._user.findByGoogle(dataEntryTest.google)).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });

  describe('#create()', () => {
    beforeEach(() => {
      this._user = new User(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._user = null;
    });

    it('should create a new entry into DB', () => {
      sandbox.stub(db, 'create').resolves(dbEntryReturn);
      return expect(this._user.create()).to.eventually.be.fulfilled;
    });

    it('should fail when create a new entry into DB', () => {
      sandbox.stub(db, 'create').rejects(dbError);
      return expect(this._user.create()).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#update()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      this._user = new User(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._user = null;
    });

    it('should update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      this._user.props.name = 'TEST';
      return expect(this._user.update()).to.eventually.be.fulfilled;
    });

    it('should NOT find any entry to update into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._user.update()).to.eventually.be.rejectedWith(Error)
          .and.to.have.property('status', 404);
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._user.update()).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });

  describe('#updateFacebook()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      this._user = new User(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._user = null;
    });

    it('should update field Facebook into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._user.updateFacebook()).to.eventually.be.fulfilled;
    });

    it('should NOT find any entry to update field Facebook into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._user.updateFacebook()).to.eventually.be.rejectedWith(Error)
          .and.to.have.property('status', 404);
    });

    it('should fail when update field Facebook into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._user.updateFacebook()).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });

  describe('#updateGoogle()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      this._user = new User(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._user = null;
    });

    it('should update field Google into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._user.updateGoogle()).to.eventually.be.fulfilled;
    });

    it('should NOT find any entry to update field Google into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._user.updateGoogle()).to.eventually.be.rejectedWith(Error)
          .and.to.have.property('status', 404);
    });

    it('should fail when update field Google into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._user.updateGoogle()).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });

  describe('#updatePassword()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      this._user = new User(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._user = null;
    });

    it('should update field Password into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._user.updatePassword()).to.eventually.be.fulfilled;
    });

    it('should NOT find any entry to update field Password into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._user.updatePassword()).to.eventually.be.rejectedWith(Error)
          .and.to.have.property('status', 404);
    });

    it('should fail when update field Password into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._user.updatePassword()).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });

  describe('#delete()', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOneAndDelete').returns(dbMock);
      this._user = new User(dataEntryTest);
    });

    afterEach(() => {
      sandbox.restore();
      this._user = null;
    });

    it('should delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(this._user.delete()).to.eventually.be.fulfilled;
    });

    it('should NOT find any entry to delete from DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(this._user.delete()).to.eventually.be.rejectedWith(Error)
          .and.to.have.property('status', 404);
    });

    it('should fail when delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(this._user.delete()).to.eventually.be.rejectedWith(Error)
          .and.to.not.have.property('status');
    });
  });
});
