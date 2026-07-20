const { Router } = require('express');
const controller = require('../controllers/cotizacion.controller');
const {
  crearCotizacionValidation,
  actualizarCotizacionValidation,
  cambiarEstadoValidation,
} = require('../validations/cotizacion.validation');
const validate = require('../middlewares/validate.middleware');
const verificarAutenticacion = require('../middlewares/auth.middleware');

const router = Router();

router.use(verificarAutenticacion);

router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/', crearCotizacionValidation, validate, controller.crear);
router.put('/:id', actualizarCotizacionValidation, validate, controller.actualizar);
router.patch('/:id/estado', cambiarEstadoValidation, validate, controller.cambiarEstado);

module.exports = router;
