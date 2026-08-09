const asyncHandler = require('../utils/asyncHandler');
const recepcionService = require('../services/recepcion.service');

// POST /api/recepcion
const recibir = asyncHandler(async (req, res) => {
  const resultado = await recepcionService.recibir(req.body, req.usuario.id);
  res.status(201).json({ success: true, data: resultado });
});

module.exports = { recibir };
