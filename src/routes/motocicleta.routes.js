const { Router } = require('express');
const controller = require('../controllers/motocicleta.controller');
const {
  crearMotocicletaValidation,
  actualizarMotocicletaValidation,
  cambiarEstadoValidation,
} = require('../validations/motocicleta.validation');
const validate = require('../middlewares/validate.middleware');
const verificarAutenticacion = require('../middlewares/auth.middleware');

const router = Router();

router.use(verificarAutenticacion);

router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/', crearMotocicletaValidation, validate, controller.crear);
router.put('/:id', actualizarMotocicletaValidation, validate, controller.actualizar);
router.patch('/:id/estado', cambiarEstadoValidation, validate, controller.cambiarEstado);

module.exports = router;
