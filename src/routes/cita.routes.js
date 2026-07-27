const { Router } = require('express');
const controller = require('../controllers/cita.controller');
const {
  crearCitaValidation,
  actualizarCitaValidation,
  cambiarEstadoValidation,
} = require('../validations/cita.validation');
const validate = require('../middlewares/validate.middleware');
const verificarAutenticacion = require('../middlewares/auth.middleware');

const router = Router();

router.use(verificarAutenticacion);

router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/', crearCitaValidation, validate, controller.crear);
router.put('/:id', actualizarCitaValidation, validate, controller.actualizar);
router.patch('/:id/estado', cambiarEstadoValidation, validate, controller.cambiarEstado);

module.exports = router;
