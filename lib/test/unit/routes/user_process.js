'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const db = require('../../../models/user');
const route = require('../../../routes/user_process');
const Helper = require('../../helper/helper');
const sandbox = sinon.createSandbox();
const expect = chai.expect;
const dbMock = Helper.getMongoDbModelMock();
const dbError = new Error();
const dataEntryTest = Helper.getFakeUser();
const dbEntryReturn = [dataEntryTest];
const router = {
  request: {
    body: dataEntryTest,
    params: dataEntryTest.iduser,
    user: dataEntryTest
  },
  response: {
    status: function() { return this; },
    json: function(params) { return params; }
  },
  next: function(err, callback) {
    return err || callback;
  }
};

chai.use(chaiAsPromised);

describe('User', () => {
  describe('#read', () => {
    beforeEach(() => {
      sandbox.stub(db, 'find').returns(dbMock);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should find an entry into DB by ID', () => {
      //TODO
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(1, 1, 'TODO');
      return expect(route.read(router.request, router.response, router.next)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Array)
        .and.to.have.lengthOf(1)
        .and.to.have.nested.property('[0]', dataEntryTest);
    });

    it('should fail to find an entry into DB by ID', () => {
      //TODO
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(1, 1, 'TODO');
      return expect(route.read(router.request, router.response, router.next(dbError))).to.eventually.be.rejectedWith(Error)
        .and.to.not.have.property('status');
    });
  });

  describe('#update', () => {
    beforeEach(() => {
      sandbox.stub(db, 'findOneAndUpdate').returns(dbMock);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(dbEntryReturn);
      return expect(route.update(router.request, router.response, router.next)).to.eventually.be.fulfilled;
    });

    it('should NOT find any entry to update into DB', () => {
      sandbox.stub(dbMock, 'exec').resolves(null);
      return expect(route.update(router.request, router.response, router.next)).to.eventually.be.fulfilled
        .and.to.have.property('status', 404);
    });

    it('should fail when update an entry into DB', () => {
      sandbox.stub(dbMock, 'exec').rejects(dbError);
      return expect(route.update(router.request, router.response, router.next)).to.eventually.be.fulfilled
        .and.to.be.instanceOf(Object);
    });
  });
});
