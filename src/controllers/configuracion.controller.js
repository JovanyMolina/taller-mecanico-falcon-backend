const asyncHandler = require('../utils/asyncHandler');
const configuracionService = require('../services/configuracion.service');
const ApiError = require('../utils/ApiError');

// GET /api/configuracion
const obtener = asyncHandler(async (req, res) => {
  const config = await configuracionService.obtener();
  res.status(200).json({ success: true, data: config });
});

// PUT /api/configuracion
const actualizar = asyncHandler(async (req, res) => {
  const config = await configuracionService.actualizar(req.body);
  res.status(200).json({ success: true, data: config });
});

// POST /api/configuracion/logo
const actualizarLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No se recibió ninguna imagen');
  }
  const config = await configuracionService.actualizarLogo(req.file);
  res.status(200).json({ success: true, data: config });
});

// GET /api/configuracion/red
const obtenerRed = asyncHandler(async (req, res) => {
  const info = configuracionService.obtenerInfoRed();
  res.status(200).json({ success: true, data: info });
});

module.exports = { obtener, actualizar, actualizarLogo, obtenerRed };