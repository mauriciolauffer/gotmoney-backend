'use strict';

import { Hono } from 'hono'
import * as transaction from './transaction_process.js';
import { isValidCreate, isValidUpdate } from '../middleware/validate_transaction.js';
import { isUserAuthenticated } from '../auth/middleware.js'

const router = new Hono()

router.use('*', isUserAuthenticated);

router.post('/', isValidCreate, transaction.create);
router.get('/', transaction.readAll);
router.get('/overdue', transaction.readOverdue);
router.get('/:year/:month', transaction.readByPeriod);
router.get('/:id', transaction.read);
router.put('/:id', isValidUpdate, transaction.update);
router.delete('/:id', transaction.remove);


export default router;
