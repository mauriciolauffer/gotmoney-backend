'use strict';

import { Hono } from 'hono'
import * as account from './account_process.js';
import { isValidCreate, isValidUpdate } from '../middleware/validate_account.js';
import { isUserAuthenticated } from '../auth/middleware.js'

const router = new Hono()

router.use('*', isUserAuthenticated);

router.post('/', isValidCreate, account.create);
router.get('/', account.readAll);
router.get('/:id', account.read);
router.put('/:id', isValidUpdate, account.update);
router.delete('/:id', account.remove);


export default router;
