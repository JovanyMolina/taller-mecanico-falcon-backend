const { body } = require('express-validator');

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('El email no es válido'),
  body('password')
    .notEmpty()
    .withMessage('El password es obligatorio'),
];

module.exports = { loginValidation };
