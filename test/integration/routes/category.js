'use strict';

const sinon = require('sinon');
const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../../../app');
const User = require('../../../controllers/user');
const mock_middleware = require('../../helper/mock_middleware');
const Helper = require('../../helper/helper');
const sandbox = sinon.createSandbox();
const agent = supertest.agent(app);
const userPayload = Helper.getFakeUser();
const payloadBase = Helper.getFakeCategory();
const idCategoryDoesNotExist = 9999999999;

describe('Routing Category', function() {
  before(() => {
    sandbox.stub(mock_middleware.getMiddleware('authenticate'), 'handle').callsFake(mock_middleware.authenticate);
    const user = new User(userPayload);
    return user.create();
  });

  after(() => {
    sandbox.restore();
    const user = new User(userPayload);
    return user.delete();
  });

  describe('POST /api/category', () => {
    it('should create category', (done) => {
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          return agent.post('/api/category')
            .send(payloadBase)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(201);
        })
        .then((res) => done())
        .catch((err) => done(err));
    });

    it('should fail when create category', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description = null;
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          return agent.post('/api/category')
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(400);
        })
        .then((res) => {
          expect(res.body).to.be.an('object')
            .and.to.have.nested.property('message', 'Invalid data!');
          expect(res.body).to.have.nested.property('error');
          return done();
        })
        .catch((err) => done(err));
    });
  });

  describe('GET /api/category', () => {
    it('should get categories', (done) => {
      agent.get('/api/category')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array').that.is.not.empty;
          return done();
        })
        .catch((err) => done(err));
    });
  });

  describe('PUT /api/category/:id', () => {
    it('should update category', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description += Date.now();
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          return agent.put('/api/category/' + payload.idcategory)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200);
        })
        .then((res) => done())
        .catch((err) => done(err));
    });

    it('should fail when update category', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description = null;
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          return agent.put('/api/category/' + payload.idcategory)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(400);
        })
        .then((res) => {
          expect(res.body).to.be.an('object')
            .and.to.have.deep.property('message', 'Invalid data!');
          expect(res.body).to.have.deep.property('error');
          return done();
        })
        .catch((err) => done(err));
    });

    it('should not find category to update', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.idcategory = idCategoryDoesNotExist;
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          return agent.put('/api/category/' + payload.idcategory)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(404);
        })
        .then((res) => done())
        .catch((err) => done(err));
    });
  });

  describe('DELETE /api/category/:id', () => {
    it('should delete category', (done) => {
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          return agent.delete('/api/category/' + payloadBase.idcategory)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200);
        })
        .then((res) => done())
        .catch((err) => done(err));
    });

    it('should not find category to delete', (done) => {
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          return agent.delete('/api/category/' + idCategoryDoesNotExist)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(404);
        })
        .then((res) => done())
        .catch((err) => done(err));
    });
  });
});
