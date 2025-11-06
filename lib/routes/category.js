'use strict';

import { Hono } from 'hono'
import * as category from './category_process.js';
import { isValidCreate, isValidUpdate } from '../middleware/validate_category.js';
import { isUserAuthenticated } from '../auth/middleware.js'

const router = new Hono()

router.use('*', isUserAuthenticated);

router.post('/', isValidCreate, category.create);
router.get('/', category.readAll);
router.get('/:id', category.read);
router.put('/:id', isValidUpdate, category.update);
router.delete('/:id', category.remove);


export default router;
