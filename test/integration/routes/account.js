'use strict';

const sinon = require('sinon');
const supertest = require('supertest');
const expect = require('chai').expect;
const app = require('../../../app');
const User = require('../../../controllers/user');
const mock_middleware = require('../../mock_middleware');
const sandbox = sinon.sandbox.create();
const agent = supertest.agent(app);
const payloadBase = {
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

//for (let i = 0; i < 5; i++) {

describe('Routing Account', () => {
  before(() => {
    sandbox.stub(mock_middleware.getMiddleware('authenticate'), 'handle').callsFake(mock_middleware.authenticate);
    const user = new User(userPayload);
    return user.create().then(() => true).catch((err) => err);
  });

  after(() => {
    sandbox.restore();
    const user = new User(userPayload);
    return user.delete().then(() => true).catch((err) => err);
  });

  describe('POST /api/account', () => {
    it('should create account', (done) => {
      getCSRFToken()
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
      getCSRFToken()
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
      payload.description += new Date().getTime();
      getCSRFToken()
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
      getCSRFToken()
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
      payload.idaccount = 999999999;
      getCSRFToken()
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
      getCSRFToken()
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
      getCSRFToken()
        .then((csrfToken) => {
          agent.delete('/api/account/' + 'A')
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
//}
