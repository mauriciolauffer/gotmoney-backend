'use strict';

const sinon = require('sinon');
const supertest = require('supertest');
const expect = require('chai').expect;
const app = require('../../../app');
const Account = require('../../../controllers/account');
const User = require('../../../controllers/user');
const mock_middleware = require('../../mock_middleware');
const sandbox = sinon.sandbox.create();
const agent = supertest.agent(app);
const payloadBase = {
  iduser: 1,
  idtransaction: 1,
  idaccount: 1,
  idparent: null,
  idstatus: 1,
  description: 'Node Unit Test',
  instalment: '1/1',
  amount: 123.45,
  type: 'D',
  startdate: new Date(),
  duedate: new Date(),
  tag: null,
  origin: 'W',
  lastchange: 14
};
const payloadBaseAccount = {
  iduser: 1,
  idaccount: 1,
  idtype: 3,
  description: 'Node Unit Test',
  creditlimit: 5,
  balance: 6,
  openingdate: new Date().toJSON(),
  duedate: 8,
  lastchange: 9
};
const userPayload = {
  iduser: 1,
  name: 'Node Unit Test',
  gender: 'F',
  birthdate: new Date().toJSON(),
  email: 'node@test.com',
  createdon: new Date().toJSON(),
  passwd: '123456'
};

function getCSRFToken() {
  return new Promise((resolve, reject) => {
    agent.get('/api/session/token')
      .expect(200)
      .end((err, res) => {
        if (err) return reject(err);
        resolve(res.body.csrfToken);
      });
  });
}

describe('Routing Transaction', () => {
  before(() => {
    sandbox.stub(mock_middleware.getMiddleware('authenticate'), 'handle').callsFake(mock_middleware.authenticate);
    const user = new User(userPayload);
    return user.create()
      .then(() => {
        const account = new Account(payloadBaseAccount);
        return account.create();
      })
      .catch((err) => err);
  });

  after(() => {
    sandbox.restore();
    const user = new User(userPayload);
    return user.delete()
      .then(() => {
        const account = new Account(payloadBaseAccount);
        return account.delete();
      })
      .catch((err) => err);
  });

  describe('POST /api/transaction', () => {
    it('should create transaction', (done) => {
      const payload = {data: [payloadBase]};
      getCSRFToken()
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
      getCSRFToken()
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
      getCSRFToken()
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
    it('should get categories', (done) => {
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
      payload.description += new Date().getTime();
      getCSRFToken()
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
      getCSRFToken()
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
      getCSRFToken()
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
      getCSRFToken()
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
      getCSRFToken()
        .then((csrfToken) => {
          agent.delete('/api/transaction/' + 'A')
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(404, done);
        })
        .catch((err) => done(err));
    });
  });
});
