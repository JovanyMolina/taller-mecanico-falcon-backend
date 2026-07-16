const { Router } = require('express');
const { checkHealth } = require('../controllers/health.controller');

const router = Router();

router.get('/', checkHealth);

module.exports = router;
