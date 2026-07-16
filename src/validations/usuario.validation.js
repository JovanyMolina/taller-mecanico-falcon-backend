const { body, param } = require('express-validator');

const ROLES_VALIDOS = ['admin', 'usuario'];

const crearUsuarioValidation = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').trim().isEmail().withMessage('El email no es válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('El password debe tener al menos 6 caracteres'),
  body('rol')
    .isIn(ROLES_VALIDOS)
    .withMessage(`El rol debe ser uno de: ${ROLES_VALIDOS.join(', ')}`),
];

const actualizarUsuarioValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').trim().isEmail().withMessage('El email no es válido'),
  body('rol')
    .isIn(ROLES_VALIDOS)
    .withMessage(`El rol debe ser uno de: ${ROLES_VALIDOS.join(', ')}`),
];

const cambiarEstadoValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  body('activo').isBoolean().withMessage('El campo activo debe ser true o false'),
];

module.exports = {
  crearUsuarioValidation,
  actualizarUsuarioValidation,
  cambiarEstadoValidation,
};
