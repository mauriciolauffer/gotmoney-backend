'use strict';

const sinon = require('sinon');
const supertest = require('supertest');
const {expect} = require('chai');
const app = require('../../../app');
const Account = require('../../../controllers/account');
const User = require('../../../controllers/user');
const Transaction = require('../../../controllers/transaction');
const mockMiddleware = require('../../helper/mock_middleware');
const Helper = require('../../helper/helper');
const sandbox = sinon.createSandbox();
const agent = supertest.agent(app);
const dbError = new Error();
const userPayload = Helper.getFakeUser();
const payloadBaseAccount = Helper.getFakeAccount();
const payloadBase = Helper.getFakeTransaction();
payloadBase.idaccount = payloadBaseAccount.idaccount;
const idTransactionDoesNotExist = 99999999995555;
let CSRF_TOKEN;

describe('Routing Transaction', () => {
  before(() => {
    sandbox.stub(mockMiddleware.getMiddleware('authenticate'), 'handle').callsFake(mockMiddleware.authenticate);
    const user = new User(userPayload);
    return user.create()
        .then(() => {
          const account = new Account(payloadBaseAccount);
          return account.create();
        })
        .then(() => Helper.getCSRFToken(agent))
        .then((csrfToken) => CSRF_TOKEN = csrfToken);
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
      agent.post('/api/transaction')
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(201)
          .then(() => done())
          .catch((err) => done(err));
    });

    it('should fail validation when create transaction', (done) => {
      const payload = {data: [Object.assign({}, payloadBase)]};
      payload.data[0].description = null;
      agent.post('/api/transaction')
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(400)
          .then((res) => {
            expect(res.body).to.be.an('object')
                .and.to.have.deep.property('message', 'Invalid data!');
            expect(res.body).to.have.deep.property('error');
            done();
          })
          .catch((err) => done(err));
    });

    it('should fail validation when create transaction, payload is not an Array', (done) => {
      agent.post('/api/transaction')
          .send({})
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(400)
          .then((res) => {
            expect(res.body).to.be.an('object')
                .and.to.have.deep.property('message', 'Invalid data!');
            expect(res.body).to.have.deep.property('error');
            done();
          })
          .catch((err) => done(err));
    });

    it('should fail when create transaction', (done) => {
      sandbox.stub(Transaction.prototype, 'create').returns(dbError);
      agent.post('/api/transaction')
          .send(payloadBase)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .then(() => done())
          .catch((err) => done(err));
    });
  });

  describe('GET /api/transaction', () => {
    it('should get transactions', (done) => {
      agent.get('/api/transaction')
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.an('array').that.is.not.empty;
            done();
          })
          .catch((err) => done(err));
    });

    it('should NOT get transactions', (done) => {
      sandbox.stub(Transaction.prototype, 'getAll').returns(dbError);
      agent.get('/api/transaction')
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .then(() => done())
          .catch((err) => done(err));
    });
  });

  describe('PUT /api/transaction/:id', () => {
    it('should update transaction', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description += Date.now();
      agent.put('/api/transaction/' + payload.idtransaction)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then(() => done())
          .catch((err) => done(err));
    });

    it('should fail validation when update transaction', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.description = null;
      agent.put('/api/transaction/' + payload.idtransaction)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(400)
          .then((res) => {
            expect(res.body).to.be.an('object')
                .and.to.have.deep.property('message', 'Invalid data!');
            expect(res.body).to.have.deep.property('error');
            done();
          })
          .catch((err) => done(err));
    });

    it('should not find transaction to update', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.idtransaction = 999999999;
      agent.put('/api/transaction/' + payload.idtransaction)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(404)
          .then(() => done())
          .catch((err) => done(err));
    });
  });

  describe('DELETE /api/transaction/:id', () => {
    it('should delete transaction', (done) => {
      agent.delete('/api/transaction/' + payloadBase.idtransaction)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then(() => done())
          .catch((err) => done(err));
    });

    it('should not find transaction to delete', (done) => {
      agent.delete('/api/transaction/' + idTransactionDoesNotExist)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(404)
          .then(() => done())
          .catch((err) => done(err));
    });
  });
});
