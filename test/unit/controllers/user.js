'use strict';

const faker = require('faker');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const db = require('../../../models/user');
const User = require('../../../controllers/user');
const Helper = require('../../helper/helper');
const CustomErrors = require('../../../utils/errors');
const expect = chai.expect;
const sandbox = sinon.createSandbox();
const dbMock = Helper.getMongoDbModelMock();
const dbError = CustomErrors.HTTP.get404();
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
    afterEach(() => {
      sandbox.restore();
    });

    it('should find an entry into DB by ID', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn[0]);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const iduser = dataEntryTest.iduser;
      const user = new User();
      return expect(user.findById(iduser)).to.eventually.be.fulfilled
        .and.to.be.an('object')
        .and.to.have.nested.property('props.iduser', dataEntryTest.iduser);
    });

    it('should fail to find an entry into DB by ID for error', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const iduser = dataEntryTest.iduser + Date.now();
      const user = new User();
      return expect(user.findById(iduser)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#findByEmail()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should find an entry into DB by email', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn[0]);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const email = dataEntryTest.email;
      const user = new User();
      return expect(user.findByEmail(email)).to.eventually.be.fulfilled
        .and.to.be.an('object')
        .and.to.have.nested.property('props.iduser', dataEntryTest.iduser);
    });

    it('should fail to find an entry into DB by email for error', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const email = dataEntryTest.email + Date.now();
      const user = new User();
      return expect(user.findByEmail(email)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#findByFacebook()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should find an entry into DB by Facebook', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn[0]);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const facebook = dataEntryTest.facebook;
      const user = new User();
      return expect(user.findByFacebook(facebook)).to.eventually.be.fulfilled
        .and.to.be.an('object')
        .and.to.have.nested.property('props.iduser', dataEntryTest.iduser);
    });

    it('should fail to find an entry into DB by Facebook for error', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const facebook = dataEntryTest.facebook + Date.now();
      const user = new User();
      return expect(user.findByFacebook(facebook)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#findByGoogle()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should find an entry into DB by Google', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn[0]);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const google = dataEntryTest.google;
      const user = new User();
      return expect(user.findByGoogle(google)).to.eventually.be.fulfilled
        .and.to.be.an('object')
        .and.to.have.nested.property('props.iduser', dataEntryTest.iduser);
    });

    it('should fail to find an entry into DB by Google for error', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOne').returns(dbMock);
      const google = dataEntryTest.google + Date.now();
      const user = new User();
      return expect(user.findByGoogle(google)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#create()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should create a new entry into DB', () => {
      sandbox.stub(db, 'create').resolves(dbEntryReturn);
      const user = new User(dataEntryTest);
      return expect(user.create()).to.eventually.be.fulfilled;
    });

    it('should fail when create a new entry into DB', () => {
      sandbox.stub(db, 'create').rejects(dbError);
      const user = new User(dataEntryTest);
      return expect(user.create()).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#update()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const user = new User(dataEntryTest);
      user.props.name = 'TEST';
      return expect(user.update()).to.eventually.be.fulfilled;
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const user = new User({
        iduser: dataEntryTest.iduser + Date.now()
      });
      return expect(user.update()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#updateFacebook()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should update Facebook field into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const user = new User(dataEntryTest);
      return expect(user.updateFacebook()).to.eventually.be.fulfilled;
    });

    it('should fail when update Facebook field into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const user = new User({
        iduser: dataEntryTest.iduser + Date.now(),
        facebook: dataEntryTest.facebook
      });
      return expect(user.updateFacebook()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#updateGoogle()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should update Google field into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const user = new User(dataEntryTest);
      return expect(user.updateGoogle()).to.eventually.be.fulfilled;
    });

    it('should fail when update Google field into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const user = new User({
        iduser: dataEntryTest.iduser + Date.now(),
        google: dataEntryTest.google
      });
      return expect(user.updateGoogle()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#updatePassword()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should update Password field into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const user = new User(dataEntryTest);
      return expect(user.updatePassword()).to.eventually.be.fulfilled;
    });

    it('should fail when update Password field into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
      const user = new User({
        iduser: dataEntryTest.iduser + Date.now(),
        passwd: dataEntryTest.passwd
      });
      return expect(user.updatePassword()).to.eventually.be.rejectedWith(Error)
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
      const user = new User(dataEntryTest);
      return expect(user.delete()).to.eventually.be.fulfilled;
    });

    it('should fail when delete an entry from DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      sandbox.stub(db, 'findOneAndDelete').returns(dbMock);
      const user = new User({
        iduser: dataEntryTest.iduser + Date.now()
      });
      return expect(user.delete()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });
});
