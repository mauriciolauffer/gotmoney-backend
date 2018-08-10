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
const payloadBase = Helper.getFakeAccount();
const idAccountDoesNotExist = 9999999999;

describe('Routing Account', () => {
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

  describe('POST /api/account', () => {
    it('should create account', (done) => {
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          return agent.post('/api/account')
            .send(payloadBase)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(201);
        })
        .then((res) => done())
        .catch((err) => done(err));
    });

    it('should fail when create account', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description = null;
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          return agent.post('/api/account')
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

  describe('GET /api/account', () => {
    it('should get accounts', (done) => {
      agent.get('/api/account')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('array').that.is.not.empty;
          err ? done(err) : done();
        });
    });
  });

  describe('PUT /api/account/:id', () => {
    it('should update account', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description += Date.now();
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.put('/api/account/' + payload.idaccount)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .end((err, res) => {
              err ? done(err) : done();
            });
        })
        .catch((err) => done(err));
    });

    it('should fail when update account', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description = null;
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.put('/api/account/' + payload.idaccount)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(400)
            .end((err, res) => {
              expect(res.body).to.be.an('object')
                .and.to.have.nested.property('message', 'Invalid data!');
              expect(res.body).to.have.nested.property('error');
              err ? done(err) : done();
            });
        })
        .catch((err) => done(err));
    });

    it('should not find account to update', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.idaccount = idAccountDoesNotExist;
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.put('/api/account/' + payload.idaccount)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(404)
            .end((err, res) => {
              err ? done(err) : done();
            });
        })
        .catch((err) => done(err));
    });
  });

  describe('DELETE /api/account/:id', () => {
    it('should delete account', (done) => {
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.delete('/api/account/' + payloadBase.idaccount)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .end((err, res) => {
              err ? done(err) : done();
            });
        })
        .catch((err) => done(err));
    });

    it('should not find account to delete', (done) => {
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.delete('/api/account/' + idAccountDoesNotExist)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(404)
            .end((err, res) => {
              err ? done(err) : done();
            });
        })
        .catch((err) => done(err));
    });
  });
});
