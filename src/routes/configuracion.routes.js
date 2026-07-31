const { Router } = require('express');
const controller = require('../controllers/configuracion.controller');
const { actualizarConfiguracionValidation } = require('../validations/configuracion.validation');
const validate = require('../middlewares/validate.middleware');
const verificarAutenticacion = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/roles.middleware');
const { uploadLogo } = require('../config/upload');

const router = Router();

router.use(verificarAutenticacion);

// Cualquier usuario autenticado puede leer los datos del negocio (ej. la hoja
// imprimible de cotizaciones los necesita, sin importar el rol de quien imprime).
router.get('/', controller.obtener);

// Solo admin puede modificar.
router.put('/', verificarRol('admin'), actualizarConfiguracionValidation, validate, controller.actualizar);
router.post('/logo', verificarRol('admin'), uploadLogo.single('logo'), controller.actualizarLogo);

module.exports = router;
