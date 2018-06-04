'use strict';

const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const passport = require('passport');
const sandbox = sinon.createSandbox();

chai.use(chaiAsPromised);

describe('Authentication', () => {
  describe('#serializeUser()', () => {
    before(() => {
      sandbox.stub(passport, 'serializeUser');
    });

    after(() => {
      sandbox.restore();
    });

    it('should send email for Recovery Password', () => {
      passport.serializeUser({}, () => {});
      sinon.assert.calledOnce(passport.serializeUser);
    });
  });

  describe('#deserializeUser()', () => {
    before(() => {
      sandbox.stub(passport, 'deserializeUser');
    });

    after(() => {
      sandbox.restore();
    });

    it('should send email for Recovery Password', () => {
      passport.deserializeUser({}, () => {});
      sinon.assert.calledOnce(passport.deserializeUser);
    });
  });
});
