'use strict';

const sinon = require('sinon');
const supertest = require('supertest');
const {expect} = require('chai');
const app = require('../../../app');
const User = require('../../../controllers/user');
const Category = require('../../../controllers/category');
const mockMiddleware = require('../../helper/mock_middleware');
const Helper = require('../../helper/helper');
const sandbox = sinon.createSandbox();
const agent = supertest.agent(app);
const dbError = new Error();
const userPayload = Helper.getFakeUser();
const payloadBase = Helper.getFakeCategory();
const idCategoryDoesNotExist = 99999999995555;
let CSRF_TOKEN;

describe('Routing Category', function() {
  before(() => {
    sandbox.stub(mockMiddleware.getMiddleware('authenticate'), 'handle').callsFake(mockMiddleware.authenticate);
    const user = new User(userPayload);
    return user.create()
        .then(() => Helper.getCSRFToken(agent))
        .then((csrfToken) => CSRF_TOKEN = csrfToken);
  });

  after(() => {
    sandbox.restore();
    const user = new User(userPayload);
    return user.delete();
  });

  describe('POST /api/category', () => {
    it('should create category', (done) => {
      agent.post('/api/category')
          .send(payloadBase)
          .set('x-csrf-token', CSRF_TOKEN)
          .expect('Content-Type', /application\/json/)
          .expect(201)
          .then(() => done())
          .catch((err) => done(err));
    });

    it('should fail validation when create category', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description = null;
      agent.post('/api/category')
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(400)
          .then((res) => {
            expect(res.body).to.be.an('object')
                .and.to.have.nested.property('message', 'Invalid data!');
            expect(res.body).to.have.nested.property('error');
            return done();
          })
          .catch((err) => done(err));
    });

    it('should fail when create category', (done) => {
      sandbox.stub(Category.prototype, 'create').returns(dbError);
      agent.post('/api/category')
          .send(payloadBase)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .then(() => done())
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
            done();
          })
          .catch((err) => done(err));
    });

    it('should NOT get categories', (done) => {
      sandbox.stub(Category.prototype, 'getAll').returns(dbError);
      agent.get('/api/category')
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .then(() => done())
          .catch((err) => done(err));
    });
  });

  describe('PUT /api/category/:id', () => {
    it('should update category', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description += Date.now();
      payload.budget = Date.now();
      agent.put('/api/category/' + payload.idcategory)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then(() => done())
          .catch((err) => done(err));
    });

    it('should fail validation when update category', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description = null;
      agent.put('/api/category/' + payload.idcategory)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(400)
          .then((res) => {
            expect(res.body).to.be.an('object')
                .and.to.have.deep.property('message', 'Invalid data!');
            expect(res.body).to.have.deep.property('error');
            return done();
          })
          .catch((err) => done(err));
    });

    it('should fail validation when update budget < 0', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.budget = -1;
      agent.put('/api/category/' + payload.idcategory)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(400)
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
      agent.put('/api/category/' + payload.idcategory)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(404)
          .then(() => done())
          .catch((err) => done(err));
    });
  });

  describe('DELETE /api/category/:id', () => {
    it('should delete category', (done) => {
      agent.delete('/api/category/' + payloadBase.idcategory)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then(() => done())
          .catch((err) => done(err));
    });

    it('should not find category to delete', (done) => {
      agent.delete('/api/category/' + idCategoryDoesNotExist)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(404)
          .then(() => done())
          .catch((err) => done(err));
    });
  });
});
