const { body, param } = require('express-validator');

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
];

const crearMotocicletaValidation = [...camposComunes];

const actualizarMotocicletaValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  ...camposComunes,
];

const cambiarEstadoValidation = [
  param('id').isInt().withMessage('El id debe ser numérico'),
  body('activo').isBoolean().withMessage('El campo activo debe ser true o false'),
];

module.exports = {
  crearMotocicletaValidation,
  actualizarMotocicletaValidation,
  cambiarEstadoValidation,
};
