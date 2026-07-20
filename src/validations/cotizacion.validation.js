const { body, param } = require('express-validator');

const TIPOS_VALIDOS = ['refaccion', 'mano_obra'];
const ESTADOS_VALIDOS = ['aprobada', 'rechazada'];

const itemsValidation = [
  body('items').isArray({ min: 1 }).withMessage('Debes incluir al menos un ítem'),
  body('items.*.tipo').isIn(TIPOS_VALIDOS).withMessage(`El tipo debe ser: ${TIPOS_VALIDOS.join(', ')}`),
  body('items.*.concepto').trim().notEmpty().withMessage('El concepto del ítem es obligatorio'),
  body('items.*.cantidad').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0'),
  body('items.*.precio_unitario').isFloat({ min: 0 }).withMessage('El precio unitario debe ser un número positivo'),
];

const crearCotizacionValidation = [
  body('moto_id').isInt().withMessage('moto_id es obligatorio y debe ser numérico'),
  ...itemsValidation,
];

const actualizarCotizacionValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  ...itemsValidation,
];

const cambiarEstadoValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  body('estado').isIn(ESTADOS_VALIDOS).withMessage(`El estado debe ser: ${ESTADOS_VALIDOS.join(', ')}`),
];

module.exports = {
  crearCotizacionValidation,
  actualizarCotizacionValidation,
  cambiarEstadoValidation,
};
