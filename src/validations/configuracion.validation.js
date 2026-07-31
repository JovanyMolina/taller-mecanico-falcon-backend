const { body } = require('express-validator');

const actualizarConfiguracionValidation = [
  body('nombre').trim().notEmpty().withMessage('El nombre del negocio es obligatorio'),
  body('direccion').optional({ checkFalsy: true }).trim(),
  body('telefono').optional({ checkFalsy: true }).trim(),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('El email no es válido'),
];

module.exports = { actualizarConfiguracionValidation };
