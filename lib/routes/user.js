'use strict';

import { Hono } from 'hono'
import * as user from './user_process.js';
import { isValidUpdate } from '../middleware/validate_user.js';
import { isUserAuthenticated } from '../auth/middleware.js'

const router = new Hono()

router.use('*', isUserAuthenticated);

router.get('/:id', user.read);

router.put('/:id', isValidUpdate, user.update);

export default router;
