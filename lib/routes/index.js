'use strict';

import { Hono } from 'hono'
import account from './account.js'
import category from './category.js'
import session from './session.js'
import transaction from './transaction.js'
import user from './user.js'

const router = new Hono()

router.route('/account', account)
router.route('/category', category)
router.route('/session', session)
router.route('/transaction', transaction)
router.route('/user', user)


export default router
