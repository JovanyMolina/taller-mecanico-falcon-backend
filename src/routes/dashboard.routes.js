const { Router } = require('express');
const controller = require('../controllers/dashboard.controller');
const verificarAutenticacion = require('../middlewares/auth.middleware');

const router = Router();

router.use(verificarAutenticacion);

router.get('/estadisticas', controller.obtenerEstadisticas);

module.exports = router;
