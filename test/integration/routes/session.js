'use strict';

const nodemailer = require('nodemailer');
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
let CSRF_TOKEN;

describe('Routing Session', () => {
  before(() => {
    const fakeSendEmailResolved = {
      sendMail: (data, callback) => {
        return Promise.resolve();
      }
    };
    sandbox.stub(nodemailer, 'createTransport').returns(fakeSendEmailResolved);
    return Helper.getCSRFToken(agent)
      .then((csrfToken) => CSRF_TOKEN = csrfToken);
  });

  after(() => {
    sandbox.restore();
    const user = new User(payloadBase);
    return user.delete();
  });

  describe('POST /api/session/signup', () => {
    it('should signup a user', (done) => {
      agent.post('/api/session/signup')
        .send(payloadBase)
        .set('x-csrf-token', CSRF_TOKEN)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(201)
        .then((res) => {
          expect(res.body).to.be.an('object');
          done();
        })
        .catch((err) => done(err));
    });

    it('should fail when signup a user, email already exist', (done) => {
      agent.post('/api/session/signup')
        .send(payloadBase)
        .set('x-csrf-token', CSRF_TOKEN)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(400)
        .then(() => done())
        .catch((err) => done(err));
    });

    it('should fail when signup a user', (done) => {
      const payload = Object.assign({}, payloadBase);
      payload.email = payload.passwd;
      agent.post('/api/session/signup')
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

  describe('POST /api/session/login', () => {
    it('should log in user', (done) => {
      agent.post('/api/session/login')
        .send({
          email: payloadBase.email,
          passwd: payloadBase.passwd
        })
        .set('x-csrf-token', CSRF_TOKEN)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(() => done())
        .catch((err) => done(err));
    });

    it('should return user is not authenticated', (done) => {
      agent.post('/api/session/login')
        .send({
          email: payloadBase.email,
          passwd: payloadBase.passwd + payloadBase.email
        })
        .set('x-csrf-token', CSRF_TOKEN)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(401)
        .then(() => done())
        .catch((err) => done(err));
    });
  });

  describe('PUT /api/session/recovery', () => {
    it('should update password', (done) => {
      agent.put('/api/session/recovery')
        .send(payloadBase)
        .set('x-csrf-token', CSRF_TOKEN)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(() => done())
        .catch((err) => done(err));
    });

    it('should fail when update password', (done) => {
      agent.put('/api/session/recovery')
        .send({email: 'xxxxx@xxxxx.xxxxx'})
        .set('x-csrf-token', CSRF_TOKEN)
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(404)
        .then(() => done())
        .catch((err) => done(err));
    });
  });

  describe('POST /api/session/facebook', () => {
    it('should fail when login Facebook', (done) => {
      agent.post('/api/session/facebook')
        .set('x-csrf-token', CSRF_TOKEN)
        .set('Authorization', 'Bearer fakeToken')
        .set('Accept', 'application/json')
        .expect(500)
        .then(() => done())
        .catch((err) => done(err));
    });
  });

  describe('POST /api/session/google', () => {
    it('should fail when login Google', (done) => {
      agent.post('/api/session/google')
        .set('x-csrf-token', CSRF_TOKEN)
        .set('Access_token', 'fakeToken')
        .set('Accept', 'application/json')
        .expect(401)
        .then(() => done())
        .catch((err) => done(err));
    });
  });

  describe('GET /api/session/loggedin', () => {
    before(() => {
      sandbox.stub(mock_middleware.getMiddleware('authenticate'), 'handle').callsFake(mock_middleware.authenticate);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return user is logged in', (done) => {
      agent.get('/api/session/loggedin')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect('x-csrf-token', /\w/)
        .expect(200)
        .then(() => done())
        .catch((err) => done(err));
    });

    it('should return user is not logged in', (done) => {
      agent.get('/api/session/loggedin')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect('x-csrf-token', /\w/)
        .expect(401)
        .then(() => done())
        .catch((err) => done(err));
    });

    it('should return a CSRF token', (done) => {
      agent.get('/api/session/loggedin')
        .expect('x-csrf-token', /\w/)
        .then(() => done())
        .catch((err) => done(err));
    });
  });

  describe('GET /api/session/logout', () => {
    it('should logout user', (done) => {
      agent.get('/api/session/logout')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .then(() => done())
        .catch((err) => done(err));
    });
  });
});
