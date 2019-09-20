'use strict';

const passport = require('passport');
const router = require('express').Router();
const validator = require('../middleware/validate_user');
const headers = require('../middleware/set_headers');
const session = require('./session_process');

router.get('/logout', session.userLogout);

router.get('/loggedin', headers.setCsrfToken, passport.isUserAuthenticated(), session.ok);

router.post('/login', validator.isValidLogin(), passport.authenticate('local-login'), session.userLogin);

router.post('/facebook', passport.authenticate('facebook'), session.ok);

router.post('/google', passport.authenticate('google'), session.ok);

router.put('/recovery', validator.isValidRecovery(), session.passwordRecovery);

router.post('/signup', validator.isValidSignup(), passport.authenticate('local-signup'), session.userSignup);

module.exports = router;
