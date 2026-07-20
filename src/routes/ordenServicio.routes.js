const { Router } = require('express');
const controller = require('../controllers/ordenServicio.controller');
const {
  crearOrdenValidation,
  actualizarOrdenValidation,
  cambiarEstadoValidation,
} = require('../validations/ordenServicio.validation');
const validate = require('../middlewares/validate.middleware');
const verificarAutenticacion = require('../middlewares/auth.middleware');

const router = Router();

router.use(verificarAutenticacion);

router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/', crearOrdenValidation, validate, controller.crear);
router.put('/:id', actualizarOrdenValidation, validate, controller.actualizar);
router.patch('/:id/estado', cambiarEstadoValidation, validate, controller.cambiarEstado);

module.exports = router;
