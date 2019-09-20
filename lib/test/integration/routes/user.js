'use strict';

const sinon = require('sinon');
const supertest = require('supertest');
const {expect} = require('chai');
const app = require('../../../app');
const User = require('../../../controllers/user');
const mock_middleware = require('../../helper/mock_middleware');
const Helper = require('../../helper/helper');
const sandbox = sinon.createSandbox();
const agent = supertest.agent(app);
const payloadBase = Helper.getFakeUser();
// const idUserDoesNotExist = 99999999995555;
let CSRF_TOKEN;

describe('Routing User', () => {
  before(() => {
    sandbox.stub(mock_middleware.getMiddleware('authenticate'), 'handle').callsFake(mock_middleware.authenticate);
    const user = new User(payloadBase);
    return user.create()
        .then(() => Helper.getCSRFToken(agent))
        .then((csrfToken) => CSRF_TOKEN = csrfToken);
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
          .then((res) => {
            expect(res.body).to.be.an('object');
            done();
          })
          .catch((err) => done(err));
    });
  });

  describe('PUT /api/user/:id', () => {
    it('should update user, no password', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.name += Date.now();
      agent.put('/api/user/' + payload.iduser)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then(() => done())
          .catch((err) => done(err));
    });

    it('should update user and password', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.name += Date.now();
      payload.passwdold = payload.passwd;
      payload.passwd = payload.passwd + Date.now();
      agent.put('/api/user/' + payload.iduser)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .then(() => done())
          .catch((err) => done(err));
    });

    it('should fail validation when update user', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.name = null;
      agent.put('/api/user/' + payload.iduser)
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

    it('should fail update password, old password invalid', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.passwdold = payload.passwd + Date.now();
      payload.passwd = payload.passwd + Date.now() + Date.now();
      agent.put('/api/user/' + payload.iduser)
          .send(payload)
          .set('x-csrf-token', CSRF_TOKEN)
          .set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(500)
          .then((res) => {
            expect(res.body).to.be.an('object')
                .and.to.have.deep.property('message', 'Invalid password!');
            expect(res.body).to.have.deep.property('error');
            done();
          })
          .catch((err) => done(err));
    });

    it('should fail validation when update password, new password invalid', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.passwdold = payload.passwd;
      payload.passwd = 'A';
      agent.put('/api/user/' + payload.iduser)
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
  });
});
