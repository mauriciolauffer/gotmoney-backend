'use strict';

const Errors = require('../../../utils/errors');
const { expect } = require('chai');

describe('Errors', () => {
  describe('Custom errors', () => {
    it('should have an HTTP property', () => {
      expect(Errors).to.be.instanceOf(Object);
      expect(Errors.HTTP).to.be.instanceOf(Object);
    });
  });

  describe('#Custom Errors HTTP', () => {
    it('should return a 404 error', () => {
      expect(Errors.HTTP.get404()).to.be.instanceOf(Error)
        .and.to.have.property('status', 404);
    });
  });
});
