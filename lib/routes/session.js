'use strict';

import { Hono } from 'hono'
import * as session from './session_process.js';
import { isValidLogin, isValidRecovery, isValidSignup } from '../middleware/validate_user.js';
import { isUserAuthenticated, localLogin, localSignup, facebookAuth, googleAuth } from '../auth/middleware.js'

const router = new Hono()

router.get('/logout', session.userLogout);

router.get('/loggedin', isUserAuthenticated, session.ok);

router.post('/login', isValidLogin, localLogin, session.userLogin);

router.post('/facebook', facebookAuth, session.ok);

router.post('/google', googleAuth, session.ok);

router.put('/recovery', isValidRecovery, session.passwordRecovery);

router.post('/signup', isValidSignup, localSignup, session.userSignup);

export default router;
