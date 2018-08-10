'use strict';

const sinon = require('sinon');
const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../../../app');
const Account = require('../../../controllers/account');
const User = require('../../../controllers/user');
const mock_middleware = require('../../helper/mock_middleware');
const Helper = require('../../helper/helper');
const sandbox = sinon.createSandbox();
const agent = supertest.agent(app);
const userPayload = Helper.getFakeUser();
const payloadBaseAccount = Helper.getFakeAccount();
const payloadBase = Helper.getFakeTransaction();
payloadBase.idaccount = payloadBaseAccount.idaccount;
const idTransactionDoesNotExist = 99999999995555;

describe('Routing Transaction', () => {
  before(() => {
    sandbox.stub(mock_middleware.getMiddleware('authenticate'), 'handle').callsFake(mock_middleware.authenticate);
    const user = new User(userPayload);
    return user.create()
      .then(() => {
        const account = new Account(payloadBaseAccount);
        return account.create();
      });
  });

  after(() => {
    sandbox.restore();
    const user = new User(userPayload);
    return user.delete()
      .then(() => {
        const account = new Account(payloadBaseAccount);
        return account.delete();
      });
  });

  describe('POST /api/transaction', () => {
    it('should create transaction', (done) => {
      const payload = {data: [payloadBase]};
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.post('/api/transaction')
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(201, done);
        })
        .catch((err) => done(err));
    });

    it('should fail when create transaction', (done) => {
      const payload = {data: [Object.assign({}, payloadBase)]};
      payload.data[0].description = null;
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.post('/api/transaction')
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(400)
            .end((err, res) => {
              expect(res.body).to.be.an('object')
                .and.to.have.deep.property('message', 'Invalid data!');
              expect(res.body).to.have.deep.property('error');
              if (err) return done(err);
              done();
            });
        })
        .catch((err) => done(err));
    });

    it('should fail when create transaction, payload is not an Array', (done) => {
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.post('/api/transaction')
            .send({})
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(400)
            .end((err, res) => {
              expect(res.body).to.be.an('object')
                .and.to.have.deep.property('message', 'Invalid data!');
              expect(res.body).to.have.deep.property('error');
              if (err) return done(err);
              done();
            });
        })
        .catch((err) => done(err));
    });
  });

  describe('GET /api/transaction', () => {
    it('should get transactions', (done) => {
      agent.get('/api/transaction')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('array').that.is.not.empty;
          done();
        });
    });
  });

  describe('PUT /api/transaction/:id', () => {
    it('should update transaction', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description += Date.now();
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.put('/api/transaction/' + payload.idtransaction)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200, done);
        })
        .catch((err) => done(err));
    });

    it('should fail when update transaction', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description = null;
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.put('/api/transaction/' + payload.idtransaction)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(400)
            .end((err, res) => {
              expect(res.body).to.be.an('object')
                .and.to.have.deep.property('message', 'Invalid data!');
              expect(res.body).to.have.deep.property('error');
              if (err) return done(err);
              done();
            });
        })
        .catch((err) => done(err));
    });

    it('should not find transaction to update', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.idtransaction = 999999999;
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.put('/api/transaction/' + payload.idtransaction)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(404, done);
        })
        .catch((err) => done(err));
    });
  });

  describe('DELETE /api/transaction/:id', () => {
    it('should delete transaction', (done) => {
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.delete('/api/transaction/' + payloadBase.idtransaction)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200, done);
        })
        .catch((err) => done(err));
    });

    it('should not find transaction to delete', (done) => {
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.delete('/api/transaction/' + idTransactionDoesNotExist)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(404, done);
        })
        .catch((err) => done(err));
    });
  });
});
