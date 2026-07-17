const asyncHandler = require('../utils/asyncHandler');
const motocicletaService = require('../services/motocicleta.service');

// POST /api/motocicletas
const crear = asyncHandler(async (req, res) => {
  const moto = await motocicletaService.crear(req.body);
  res.status(201).json({ success: true, data: moto });
});

// GET /api/motocicletas?q=busqueda
const listar = asyncHandler(async (req, res) => {
  const motos = await motocicletaService.listar(req.query.q);
  res.status(200).json({ success: true, data: motos });
});

// GET /api/motocicletas/:id
const obtenerPorId = asyncHandler(async (req, res) => {
  const moto = await motocicletaService.obtenerPorId(req.params.id);
  res.status(200).json({ success: true, data: moto });
});

// PUT /api/motocicletas/:id
const actualizar = asyncHandler(async (req, res) => {
  const moto = await motocicletaService.actualizar(req.params.id, req.body);
  res.status(200).json({ success: true, data: moto });
});

// PATCH /api/motocicletas/:id/estado
const cambiarEstado = asyncHandler(async (req, res) => {
  const moto = await motocicletaService.cambiarEstado(req.params.id, req.body.activo);
  res.status(200).json({ success: true, data: moto });
});

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado };
