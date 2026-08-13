const asyncHandler = require('../utils/asyncHandler');
const cotizacionService = require('../services/cotizacion.service');

// POST /api/cotizaciones
const crear = asyncHandler(async (req, res) => {
  const cotizacion = await cotizacionService.crear(req.body, req.usuario.id);
  res.status(201).json({ success: true, data: cotizacion });
});

// GET /api/cotizaciones?estado=&q=
const listar = asyncHandler(async (req, res) => {
  const cotizaciones = await cotizacionService.listar({
    estado: req.query.estado,
    busqueda: req.query.q,
  });
  res.status(200).json({ success: true, data: cotizaciones });
});

// GET /api/cotizaciones/:id
const obtenerPorId = asyncHandler(async (req, res) => {
  const cotizacion = await cotizacionService.obtenerPorId(req.params.id);
  res.status(200).json({ success: true, data: cotizacion });
});

// PUT /api/cotizaciones/:id
const actualizar = asyncHandler(async (req, res) => {
  const cotizacion = await cotizacionService.actualizar(req.params.id, req.body);
  res.status(200).json({ success: true, data: cotizacion });
});

// PATCH /api/cotizaciones/:id/estado
const cambiarEstado = asyncHandler(async (req, res) => {
  const cotizacion = await cotizacionService.cambiarEstado(req.params.id, req.body.estado, req.body.motivo_rechazo);
  res.status(200).json({ success: true, data: cotizacion });
});

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado };
