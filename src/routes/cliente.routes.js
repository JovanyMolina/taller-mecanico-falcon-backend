const { Router } = require('express');
const controller = require('../controllers/cliente.controller');
const {
  crearClienteValidation,
  actualizarClienteValidation,
  cambiarEstadoValidation,
} = require('../validations/cliente.validation');
const validate = require('../middlewares/validate.middleware');
const verificarAutenticacion = require('../middlewares/auth.middleware');

const router = Router();

router.use(verificarAutenticacion);

router.get('/', controller.listar);
router.get('/:id/historial', controller.obtenerHistorial);
router.get('/:id', controller.obtenerPorId);
router.post('/', crearClienteValidation, validate, controller.crear);
router.put('/:id', actualizarClienteValidation, validate, controller.actualizar);
router.patch('/:id/estado', cambiarEstadoValidation, validate, controller.cambiarEstado);

module.exports = router;
