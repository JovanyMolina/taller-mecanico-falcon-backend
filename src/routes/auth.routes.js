const { Router } = require('express');
const { login } = require('../controllers/auth.controller');
const { loginValidation } = require('../validations/auth.validation');
const validate = require('../middlewares/validate.middleware');

const router = Router();

router.post('/login', loginValidation, validate, login);

module.exports = router;
