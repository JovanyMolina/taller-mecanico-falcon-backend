const { Router } = require('express');
const controller = require('../controllers/configuracion.controller');
const { actualizarConfiguracionValidation } = require('../validations/configuracion.validation');
const validate = require('../middlewares/validate.middleware');
const verificarAutenticacion = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/roles.middleware');
const { uploadLogo } = require('../config/upload');

const router = Router();

router.use(verificarAutenticacion);

router.get('/', controller.obtener);

router.put('/', verificarRol('admin'), actualizarConfiguracionValidation, validate, controller.actualizar);
router.post('/logo', verificarRol('admin'), uploadLogo.single('logo'), controller.actualizarLogo);

module.exports = router;
