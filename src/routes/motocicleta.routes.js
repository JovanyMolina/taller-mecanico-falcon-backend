const { Router } = require('express');
const controller = require('../controllers/motocicleta.controller');
const {
  crearMotocicletaValidation,
  actualizarMotocicletaValidation,
  cambiarActivoValidation,
  cambiarEstadoServicioValidation,
} = require('../validations/motocicleta.validation');
const validate = require('../middlewares/validate.middleware');
const verificarAutenticacion = require('../middlewares/auth.middleware');

const router = Router();

router.use(verificarAutenticacion);

router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/', crearMotocicletaValidation, validate, controller.crear);
router.put('/:id', actualizarMotocicletaValidation, validate, controller.actualizar);
router.patch('/:id/activo', cambiarActivoValidation, validate, controller.cambiarActivo);
router.patch('/:id/estado', cambiarEstadoServicioValidation, validate, controller.cambiarEstadoServicio);

module.exports = router;
