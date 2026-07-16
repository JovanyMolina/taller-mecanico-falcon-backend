const { Router } = require('express');
const controller = require('../controllers/usuario.controller');
const {
  crearUsuarioValidation,
  actualizarUsuarioValidation,
  cambiarEstadoValidation,
} = require('../validations/usuario.validation');
const validate = require('../middlewares/validate.middleware');
const verificarAutenticacion = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/roles.middleware');

const router = Router();


router.use(verificarAutenticacion, verificarRol('admin'));

router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/', crearUsuarioValidation, validate, controller.crear);
router.put('/:id', actualizarUsuarioValidation, validate, controller.actualizar);
router.patch('/:id/estado', cambiarEstadoValidation, validate, controller.cambiarEstado);

module.exports = router;
