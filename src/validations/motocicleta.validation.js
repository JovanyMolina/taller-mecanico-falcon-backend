const { body, param } = require('express-validator');

const ESTADOS_SERVICIO_VALIDOS = ['recibida', 'en_diagnostico', 'en_reparacion', 'lista', 'entregada'];

const camposComunes = [
  body('cliente_id').isInt().withMessage('El cliente_id es obligatorio y debe ser numérico'),
  body('marca').trim().notEmpty().withMessage('La marca es obligatoria'),
  body('modelo').trim().notEmpty().withMessage('El modelo es obligatorio'),
  body('anio')
    .optional({ checkFalsy: true })
    .isInt({ min: 1950, max: new Date().getFullYear() + 1 })
    .withMessage('El año no es válido'),
  body('placa').optional({ checkFalsy: true }).trim().isLength({ min: 5, max: 20 })
    .withMessage('La placa debe tener entre 5 y 20 caracteres'),
  body('color').optional({ checkFalsy: true }).trim(),
  body('kilometraje').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('El kilometraje debe ser un número positivo'),
  body('falla_reportada').optional({ checkFalsy: true }).trim(),
  body('recibido_por').optional({ checkFalsy: true }).isInt().withMessage('recibido_por debe ser numérico'),
];

const crearMotocicletaValidation = [...camposComunes];

const actualizarMotocicletaValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  ...camposComunes,
];

const cambiarActivoValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  body('activo').isBoolean().withMessage('El campo activo debe ser true o false'),
];

const cambiarEstadoServicioValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  body('estado')
    .isIn(ESTADOS_SERVICIO_VALIDOS)
    .withMessage(`El estado debe ser uno de: ${ESTADOS_SERVICIO_VALIDOS.join(', ')}`),
];

module.exports = {
  crearMotocicletaValidation,
  actualizarMotocicletaValidation,
  cambiarActivoValidation,
  cambiarEstadoServicioValidation,
};
