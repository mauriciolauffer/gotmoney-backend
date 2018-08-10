'use strict';

const faker = require('faker');
const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const nodemailer = require('nodemailer');
const mailer = require('../../../utils/mailer');
const expect = chai.expect;
const sandbox = sinon.createSandbox();
const email = faker.internet.email();
const password = faker.internet.password();
const error = new Error('Error Mail');
const fakeSendEmailResolved = {
  sendMail: (data, callback) => {
    return Promise.resolve();
  }
};
const fakeSendEmailRejected = {
  sendMail: (data, callback) => {
    return Promise.reject(error);
  }
};

chai.use(chaiAsPromised);

describe('Mailer', () => {
  describe('ENV variables', () => {
    it('should get ENV variables', () => {
      expect(process.env).to.have.property('NODE_ENV', 'test');
      expect(process.env).to.have.property('EMAIL_HOST');
      expect(process.env).to.have.property('EMAIL_PORT');
      expect(process.env).to.have.property('EMAIL_USER');
      expect(process.env).to.have.property('EMAIL_PASSWORD');
      expect(process.env).to.have.property('EMAIL_FROM');
    });
  });

  describe('#sendRecoveryPassword()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should send email for Recovery Password', () => {
      sandbox.stub(nodemailer, 'createTransport').returns(fakeSendEmailResolved);
      return expect(mailer.sendRecoveryPassword(email, password)).to.eventually.be.fulfilled;
    });

    it('should fail when send email for Recovery Password', () => {
      sandbox.stub(nodemailer, 'createTransport').returns(fakeSendEmailRejected);
      return expect(mailer.sendRecoveryPassword(email, password)).to.eventually.be.rejectedWith(Error);
    });
  });

  describe('#sendNewUser()', () => {
    afterEach(() => {
      sandbox.restore();
    });

    it('should send email for New User', () => {
      sandbox.stub(nodemailer, 'createTransport').returns(fakeSendEmailResolved);
      return expect(mailer.sendNewUser(email, password)).to.eventually.be.fulfilled;
    });

    it('should fail when send email for New User', () => {
      sandbox.stub(nodemailer, 'createTransport').returns(fakeSendEmailRejected);
      return expect(mailer.sendNewUser(email, password)).to.eventually.be.rejectedWith(Error);
    });
  });
});
