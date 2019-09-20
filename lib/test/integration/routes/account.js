'use strict';

const sinon = require('sinon');
const supertest = require('supertest');
const {expect} = require('chai');
const app = require('../../../app');
const User = require('../../../controllers/user');
const Account = require('../../../controllers/account');
const mock_middleware = require('../../helper/mock_middleware');
const Helper = require('../../helper/helper');
const sandbox = sinon.createSandbox();
const agent = supertest.agent(app);
const dbError = new Error();
const userPayload = Helper.getFakeUser();
const payloadBase = Helper.getFakeAccount();
const idAccountDoesNotExist = 99999999995555;
let CSRF_TOKEN;

describe('Routing Account', () => {
  before(() => {
    sandbox.stub(mock_middleware.getMiddleware('authenticate'), 'handle').callsFake(mock_middleware.authenticate);
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

  describe('POST /api/account', () => {
    it('should create account', (done) => {
      agent.post('/api/account')
          .send(payloadBase)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(201)
          .then(() => done())
          .catch((err) => done(err));
    });

    it('should fail validation when create account', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description = null;
      agent.post('/api/account')
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

    it('should fail when create account', (done) => {
      sandbox.stub(Account.prototype, 'create').returns(dbError);
      agent.post('/api/account')
          .send(payloadBase)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .then(() => done())
          .catch((err) => done(err));
    });
  });

  describe('GET /api/account', () => {
    it('should get accounts', (done) => {
      agent.get('/api/account')
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array').that.is.not.empty;
            done();
          })
          .catch((err) => done(err));
    });

    it('should NOT get accounts', (done) => {
      sandbox.stub(Account.prototype, 'getAll').returns(dbError);
      agent.get('/api/account')
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .then(() => done())
          .catch((err) => done(err));
    });
  });

  describe('PUT /api/account/:id', () => {
    it('should update account', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description += Date.now();
      agent.put('/api/account/' + payload.idaccount)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then(() => done())
          .catch((err) => done(err));
    });

    it('should fail validation when update account', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description = null;
      agent.put('/api/account/' + payload.idaccount)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(400)
          .then((res) => {
            expect(res.body).to.be.an('object')
                .and.to.have.nested.property('message', 'Invalid data!');
            expect(res.body).to.have.nested.property('error');
            done();
          })
          .catch((err) => done(err));
    });

    it('should not find account to update', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.idaccount = idAccountDoesNotExist;
      agent.put('/api/account/' + payload.idaccount)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(404)
          .then(() => done())
          .catch((err) => done(err));
    });
  });

  describe('DELETE /api/account/:id', () => {
    it('should delete account', (done) => {
      agent.delete('/api/account/' + payloadBase.idaccount)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then(() => done())
          .catch((err) => done(err));
    });

    it('should not find account to delete', (done) => {
      agent.delete('/api/account/' + idAccountDoesNotExist)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(404)
          .then(() => done())
          .catch((err) => done(err));
    });
  });
});
