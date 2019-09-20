'use strict';

const router = require('express').Router();

router.use('/account', require('./account'));
router.use('/category', require('./category'));
router.use('/session', require('./session'));
router.use('/transaction', require('./transaction'));
router.use('/user', require('./user'));

module.exports = router;
