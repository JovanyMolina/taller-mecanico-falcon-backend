const { body, param } = require('express-validator');

const ESTADOS_VALIDOS = ['pendiente', 'en_proceso', 'terminada', 'entregada', 'cancelada'];

const crearOrdenValidation = [
  body('moto_id').isInt().withMessage('moto_id es obligatorio y debe ser numérico'),
  body('cotizacion_id').optional({ checkFalsy: true }).isInt().withMessage('cotizacion_id debe ser numérico'),
  body('tecnico_asignado').optional({ checkFalsy: true }).isInt().withMessage('tecnico_asignado debe ser numérico'),
  body('fecha_entrega_estimada').optional({ checkFalsy: true }).isISO8601().withMessage('La fecha estimada no es válida'),
  body('observaciones').optional({ checkFalsy: true }).trim(),
];

const actualizarOrdenValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  body('tecnico_asignado').optional({ checkFalsy: true }).isInt().withMessage('tecnico_asignado debe ser numérico'),
  body('fecha_entrega_estimada').optional({ checkFalsy: true }).isISO8601().withMessage('La fecha estimada no es válida'),
  body('observaciones').optional({ checkFalsy: true }).trim(),
];

const cambiarEstadoValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  body('estado').isIn(ESTADOS_VALIDOS).withMessage(`El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`),
  body('fecha_entrega_real').optional({ checkFalsy: true }).isISO8601().withMessage('La fecha de entrega no es válida'),
];

module.exports = {
  crearOrdenValidation,
  actualizarOrdenValidation,
  cambiarEstadoValidation,
};
