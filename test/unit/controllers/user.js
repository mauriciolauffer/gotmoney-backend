'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const db = require('../../../models/database');
const User = require('../../../controllers/user');
const expect = chai.expect;
const sandbox = sinon.sandbox.create();
const dataEntryTest = {
  iduser: 9999999999,
  name: 2,
  gender: 3,
  birthdate: 4,
  email: 5,
  createdon: 6,
  passwd: 7,
  alert: 1,
  facebook: 9,
  google: 10,
  twitter: 11,
  lastchange: 12
};
const dbEntryReturn = [dataEntryTest];
const dbError = new Error('Test error');
dbError.status = 404;

chai.use(chaiAsPromised);

describe('User', () => {
  describe('#contructor', () => {
    it('should get a new instance', () => {
      expect(new User()).to.be.an('object');
    });

    it('should get a new instance and set properties', () => {
      const user = new User(dataEntryTest);
      expect(user).to.have.property('props');
      expect(user.props.iduser).to.equal(9999999999);
      expect(user.props.name).to.equal(2);
      expect(user.props.gender).to.equal(3);
      expect(user.props.birthdate).to.equal(4);
      expect(user.props.email).to.equal(5);
      expect(user.props.createdon).to.equal(6);
      expect(user.props.passwd).to.equal(7);
      expect(user.props.alert).to.equal(1);
      expect(user.props.facebook).to.equal(9);
      expect(user.props.google).to.equal(10);
      expect(user.props.twitter).to.equal(11);
      expect(user.props.lastchange).to.equal(12);
    });
  });

  describe('#setProperties()', () => {
    it('should set properties for instance', () => {
      const user = new User();
      user.setProperties(dataEntryTest);
      expect(user.props.iduser).to.equal(9999999999);
      expect(user.props.name).to.equal(2);
      expect(user.props.gender).to.equal(3);
      expect(user.props.birthdate).to.equal(4);
      expect(user.props.email).to.equal(5);
      expect(user.props.createdon).to.equal(6);
      expect(user.props.passwd).to.equal(7);
      expect(user.props.alert).to.equal(1);
      expect(user.props.facebook).to.equal(9);
      expect(user.props.google).to.equal(10);
      expect(user.props.twitter).to.equal(11);
      expect(user.props.lastchange).to.equal(12);
    });
  });

  describe('#getProperties()', () => {
    it('should get properties from instance', () => {
      const user = new User(dataEntryTest);
      const data = user.getProperties();
      expect(data.iduser).to.equal(9999999999);
      expect(data.name).to.equal(2);
      expect(data.gender).to.equal(3);
      expect(data.birthdate).to.equal(4);
      expect(data.email).to.equal(5);
      expect(data.createdon).to.equal(6);
      expect(data.passwd).to.not.exist;
      expect(data.alert).to.equal(1);
      expect(data.facebook).to.equal(9);
      expect(data.google).to.equal(10);
      expect(data.twitter).to.equal(11);
      expect(data.lastchange).to.equal(12);
    });

    it('should change data from #getProperties() and does not affect instance', () => {
      const user = new User(dataEntryTest);
      const data = user.getProperties();
      data.name = 25;
      expect(user.props.name).to.equal(2)
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
      const password = 'A';
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
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const iduser = 3;
      const user = new User();
      return expect(user.findById(iduser)).to.eventually.be.fulfilled
        .and.to.be.an('object')
        .and.to.have.nested.property('props.iduser', dataEntryTest.iduser);
    });

    it('should fail to find an entry into DB by ID', () => {
      sandbox.stub(db, 'executePromise').resolves([]);
      const iduser = 'A';
      const user = new User();
      return expect(user.findById(iduser)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });

    it('should fail to find an entry into DB by ID for error', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const iduser = 'A';
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
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const email = 'teste@hotm.com';
      const user = new User();
      return expect(user.findByEmail(email)).to.eventually.be.fulfilled
        .and.to.be.an('object')
        .and.to.have.nested.property('props.iduser', dataEntryTest.iduser);
    });

    it('should fail to find an entry into DB by email', () => {
      sandbox.stub(db, 'executePromise').resolves([]);
      const email = 'A';
      const user = new User();
      return expect(user.findByEmail(email)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });

    it('should fail to find an entry into DB by email for error', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const email = 'A';
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
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const facebook = dataEntryTest.facebook;
      const user = new User();
      return expect(user.findByFacebook(facebook)).to.eventually.be.fulfilled
        .and.to.be.an('object')
        .and.to.have.nested.property('props.iduser', dataEntryTest.iduser);
    });

    it('should fail to find an entry into DB by Facebook', () => {
      sandbox.stub(db, 'executePromise').resolves([]);
      const facebook = 'A';
      const user = new User();
      return expect(user.findByFacebook(facebook)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });

    it('should fail to find an entry into DB by Facebook for error', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const facebook = 'A';
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
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const google = dataEntryTest.google;
      const user = new User();
      return expect(user.findByGoogle(google)).to.eventually.be.fulfilled
        .and.to.be.an('object')
        .and.to.have.nested.property('props.iduser', dataEntryTest.iduser);
    });

    it('should fail to find an entry into DB by Google', () => {
      sandbox.stub(db, 'executePromise').resolves([]);
      const google = 'A';
      const user = new User();
      return expect(user.findByGoogle(google)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });

    it('should fail to find an entry into DB by Google for error', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const google = 'A';
      const user = new User();
      return expect(user.findByGoogle(google)).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#create()', () => {
    /*after((done) => {
     const user = new User(dataEntryTest);
     user.delete()
     .then(() => done())
     .catch((err) => done(err));
     });*/

    afterEach(() => {
      sandbox.restore();
    });

    it('should create a new entry into DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const user = new User(dataEntryTest);
      return expect(user.create()).to.eventually.be.fulfilled;
    });

    it('should fail when create a new entry into DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const user = new User(dataEntryTest);
      return expect(user.create()).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#update()', () => {
    /*before((done) => {
     const user = new User(dataEntryTest);
     user.create()
     .then(() => done())
     .catch((err) => done(err));
     });

     after((done) => {
     const user = new User(dataEntryTest);
     user.delete()
     .then(() => done())
     .catch((err) => done(err));
     });*/

    afterEach(() => {
      sandbox.restore();
    });

    it('should update an entry into DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const user = new User(dataEntryTest);
      user.props.name = 'TEST';
      return expect(user.update()).to.eventually.be.fulfilled;
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const user = new User({
        iduser: 'A'
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
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const user = new User(dataEntryTest);
      return expect(user.updateFacebook()).to.eventually.be.fulfilled;
    });

    it('should fail when update Facebook field into DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const user = new User({
        iduser: 'A',
        facebook: 123
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
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const user = new User(dataEntryTest);
      return expect(user.updateGoogle()).to.eventually.be.fulfilled;
    });

    it('should fail when update Google field into DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const user = new User({
        iduser: 'A',
        google: 123
      });
      return expect(user.updateGoogle()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#updatePassword()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should update Google field into DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const user = new User(dataEntryTest);
      return expect(user.updatePassword()).to.eventually.be.fulfilled;
    });

    it('should fail when update Google field into DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const user = new User({
        iduser: 'A',
        passwd: 12345
      });
      return expect(user.updatePassword()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });

  describe('#delete()', () => {
    /*before((done) => {
     const user = new User(dataEntryTest);
     user.create()
     .then(() => done())
     .catch((err) => done(err));
     });*/

    afterEach(() => {
      sandbox.restore();
    });

    it('should delete an entry from DB', () => {
      sandbox.stub(db, 'executePromise').resolves(dbEntryReturn);
      const user = new User(dataEntryTest);
      return expect(user.delete()).to.eventually.be.fulfilled;
    });

    it('should fail when delete an entry from DB', () => {
      sandbox.stub(db, 'executePromise').rejects(dbError);
      const user = new User({
        iduser: 'A'
      });
      return expect(user.delete()).to.eventually.be.rejectedWith(Error)
        .and.to.have.property('status', 404);
    });
  });
});
