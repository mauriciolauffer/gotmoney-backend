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
const payloadBase = Helper.getFakeUser();
const idUserDoesNotExist = 99999999995555;

describe('Routing User', () => {
  before(() => {
    sandbox.stub(mock_middleware.getMiddleware('authenticate'), 'handle').callsFake(mock_middleware.authenticate);
    const user = new User(payloadBase);
    return user.create();
  });

  after(() => {
    sandbox.restore();
    const user = new User(payloadBase);
    return user.delete();
  });

  describe('GET /api/user/:id', () => {
    it('should get user', (done) => {
      agent.get('/api/user/' + payloadBase.iduser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('should get user', () => {
      agent.get('/api/user/' + idUserDoesNotExist)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(404);
    });
  });

  describe('PUT /api/user/:id', () => {
    it('should update user, no password', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.name += Date.now();
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.put('/api/user/' + payload.iduser)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .end((err, res) => { return (err) ? done(err) : done(); });
        })
        .catch((err) => done(err));
    });

    it('should update user and password', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.name += Date.now();
      payload.passwdold = payload.passwd;
      payload.passwd = payload.passwd + Date.now();
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.put('/api/user/' + payload.iduser)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(200)
            .end((err, res) => { return (err) ? done(err) : done(); });
        })
        .catch((err) => done(err));
    });

    it('should fail when update user', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.name = null;
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.put('/api/user/' + payload.iduser)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(400)
            .end((err, res) => {
              expect(res.body).to.be.an('object')
                .and.to.have.deep.property('message', 'Invalid data!');
              expect(res.body).to.have.deep.property('error');
              return (err) ? done(err) : done();
            });
        })
        .catch((err) => done(err));
    });

    it('should fail update password, old password invalid', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.passwdold = payload.passwd + Date.now();
      payload.passwd = payload.passwd + Date.now() + Date.now();
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.put('/api/user/' + payload.iduser)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(500)
            .end((err, res) => {
              expect(res.body).to.be.an('object')
                .and.to.have.deep.property('message', 'Invalid password!');
              expect(res.body).to.have.deep.property('error');
              return (err) ? done(err) : done();
            });
        })
        .catch((err) => done(err));
    });

    it('should fail update password, new password invalid', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.passwdold = payload.passwd;
      payload.passwd = 'A';
      Helper.getCSRFToken(agent)
        .then((csrfToken) => {
          agent.put('/api/user/' + payload.iduser)
            .send(payload)
            .set('x-csrf-token', csrfToken)
            .set('Accept', 'application/json')
            .expect('Content-Type', /application\/json/)
            .expect(400)
            .end((err, res) => {
              expect(res.body).to.be.an('object')
                .and.to.have.deep.property('message', 'Invalid data!');
              expect(res.body).to.have.deep.property('error');
              return (err) ? done(err) : done();
            });
        })
        .catch((err) => done(err));
    });
  });
});
