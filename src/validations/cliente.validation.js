const { body, param } = require('express-validator');

const crearClienteValidation = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('telefono')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es obligatorio')
    .isLength({ min: 10 })
    .withMessage('El teléfono debe tener al menos 10 dígitos'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('El email no es válido'),
  body('direccion').optional({ checkFalsy: true }).trim(),
];

const actualizarClienteValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  ...crearClienteValidation,
];

const cambiarEstadoValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  body('activo').isBoolean().withMessage('El campo activo debe ser true o false'),
];

module.exports = {
  crearClienteValidation,
  actualizarClienteValidation,
  cambiarEstadoValidation,
};
