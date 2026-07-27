const asyncHandler = require('../utils/asyncHandler');
const citaService = require('../services/cita.service');

// POST /api/citas
const crear = asyncHandler(async (req, res) => {
  const cita = await citaService.crear(req.body, req.usuario.id);
  res.status(201).json({ success: true, data: cita });
});

// GET /api/citas?desde=&hasta=&q=
const listar = asyncHandler(async (req, res) => {
  const citas = await citaService.listar({
    desde: req.query.desde,
    hasta: req.query.hasta,
    busqueda: req.query.q,
  });
  res.status(200).json({ success: true, data: citas });
});

// GET /api/citas/:id
const obtenerPorId = asyncHandler(async (req, res) => {
  const cita = await citaService.obtenerPorId(req.params.id);
  res.status(200).json({ success: true, data: cita });
});

// PUT /api/citas/:id
const actualizar = asyncHandler(async (req, res) => {
  const cita = await citaService.actualizar(req.params.id, req.body);
  res.status(200).json({ success: true, data: cita });
});

// PATCH /api/citas/:id/estado
const cambiarEstado = asyncHandler(async (req, res) => {
  const cita = await citaService.cambiarEstado(req.params.id, req.body.estado);
  res.status(200).json({ success: true, data: cita });
});

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado };
