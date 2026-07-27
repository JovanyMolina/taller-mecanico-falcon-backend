const { body, param } = require('express-validator');

const ESTADOS_VALIDOS = ['confirmada', 'completada', 'cancelada'];

const crearCitaValidation = [
  body('cliente_id').isInt().withMessage('cliente_id es obligatorio y debe ser numérico'),
  body('moto_id').optional({ checkFalsy: true }).isInt().withMessage('moto_id debe ser numérico'),
  body('fecha').isISO8601().withMessage('La fecha es obligatoria y debe ser válida'),
  body('hora').optional({ checkFalsy: true }).matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('La hora no es válida'),
  body('motivo').optional({ checkFalsy: true }).trim(),
];

const actualizarCitaValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  body('moto_id').optional({ checkFalsy: true }).isInt().withMessage('moto_id debe ser numérico'),
  body('fecha').isISO8601().withMessage('La fecha es obligatoria y debe ser válida'),
  body('hora').optional({ checkFalsy: true }).matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('La hora no es válida'),
  body('motivo').optional({ checkFalsy: true }).trim(),
];

const cambiarEstadoValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  body('estado').isIn(ESTADOS_VALIDOS).withMessage(`El estado debe ser: ${ESTADOS_VALIDOS.join(', ')}`),
];

module.exports = {
  crearCitaValidation,
  actualizarCitaValidation,
  cambiarEstadoValidation,
};
