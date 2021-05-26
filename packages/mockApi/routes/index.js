// The Postman collection chould be downloaded from
// https://www.getpostman.com/collections/f6e237c8ce2282dbd6b1

const router = require('express').Router();

router.use('/api/account', require('./account'));
router.use('/api/me', require('./me'));
router.use('/api/orgs', require('./orgs'));
router.use('/api/profile', require('./profile'));
router.use('/api/social', require('./social'));
router.use('/api/login', require('./login'));
router.use('/api/forgot', require('./forgot'));
router.use('/social/login/:provider', require('./social/login'));
module.exports = router;
