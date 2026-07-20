const asyncHandler = require('../utils/asyncHandler');
const ordenService = require('../services/ordenServicio.service');

// POST /api/ordenes
const crear = asyncHandler(async (req, res) => {
  const orden = await ordenService.crear(req.body);
  res.status(201).json({ success: true, data: orden });
});

// GET /api/ordenes?estado=&q=
const listar = asyncHandler(async (req, res) => {
  const ordenes = await ordenService.listar({
    estado: req.query.estado,
    busqueda: req.query.q,
  });
  res.status(200).json({ success: true, data: ordenes });
});

// GET /api/ordenes/:id
const obtenerPorId = asyncHandler(async (req, res) => {
  const orden = await ordenService.obtenerPorId(req.params.id);
  res.status(200).json({ success: true, data: orden });
});

// PUT /api/ordenes/:id
const actualizar = asyncHandler(async (req, res) => {
  const orden = await ordenService.actualizar(req.params.id, req.body);
  res.status(200).json({ success: true, data: orden });
});

// PATCH /api/ordenes/:id/estado
const cambiarEstado = asyncHandler(async (req, res) => {
  const orden = await ordenService.cambiarEstado(
    req.params.id,
    req.body.estado,
    req.body.fecha_entrega
  );
  res.status(200).json({ success: true, data: orden });
});

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado };
