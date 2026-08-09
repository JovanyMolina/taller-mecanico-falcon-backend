const { Router } = require('express');
const controller = require('../controllers/recepcion.controller');
const verificarAutenticacion = require('../middlewares/auth.middleware');

const router = Router();

router.use(verificarAutenticacion);

router.post('/', controller.recibir);

module.exports = router;
