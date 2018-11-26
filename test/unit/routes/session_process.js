'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const route = require('../../../routes/session_process');
const Helper = require('../../helper/helper');
const expect = chai.expect;
const fakeUser = Helper.getFakeUser();
const dataEntryTest = {
  iduser: fakeUser.iduser,
  email: fakeUser.email,
  name: fakeUser.name
};
const router = {
  request: {
    body: dataEntryTest,
    params: dataEntryTest.iduser,
    user: dataEntryTest,
    logout: function() { return this; }
  },
  response: {
    status: function() { return this; },
    json: (params) => params
  },
  next: (err, callback) => err || callback
};

chai.use(chaiAsPromised);

describe('Session', () => {
  describe('#ok', () => {
    it('should return OK', () => {
      //TODO
      expect(1, 1, 'TODO');
      return;
      expect(route.ok(router.request, router.response, router.next)).to.be.an.instanceof(Object);
    });
  });

  describe('#userLogin', () => {
    it('should find an entry into DB by ID', () => {
      //TODO
      expect(1, 1, 'TODO');
      return;
      expect(route.userLogin(router.request, router.response, router.next)).to.equal(dataEntryTest);
    });
  });

  describe('#userLogout', () => {
    it('should update an entry into DB', () => {
      //TODO
      expect(1, 1, 'TODO');
      return;
      expect(route.userLogout(router.request, router.response, router.next)).to.equal(dataEntryTest);
    });
  });

  describe('#userSignup', () => {
    it('should delete an entry from DB', () => {
      //TODO
      expect(1, 1, 'TODO');
      return;
      expect(route.userSignup(router.request, router.response, router.next)).to.equal(dataEntryTest);
    });
  });

  describe('#passwordRecovery', () => {
    it('should delete an entry from DB', () => {
      //TODO
      expect(1, 1, 'TODO');
    });
  });
});
