const asyncHandler = require('../utils/asyncHandler');
const motocicletaService = require('../services/motocicleta.service');

// POST /api/motocicletas
const crear = asyncHandler(async (req, res) => {
  const moto = await motocicletaService.crear(req.body);
  res.status(201).json({ success: true, data: moto });
});

// GET /api/motocicletas?q=busqueda
const listar = asyncHandler(async (req, res) => {
  const motos = await motocicletaService.listar({
    estado: req.query.estado,
    busqueda: req.query.q,
  });
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

// PATCH /api/motocicletas/:id/activo
const cambiarActivo = asyncHandler(async (req, res) => {
  const moto = await motocicletaService.cambiarActivo(req.params.id, req.body.activo);
  res.status(200).json({ success: true, data: moto });
});

// PATCH /api/motocicletas/:id/estado
const cambiarEstadoServicio = asyncHandler(async (req, res) => {
  const moto = await motocicletaService.cambiarEstadoServicio(req.params.id, req.body.estado);
  res.status(200).json({ success: true, data: moto });
});

module.exports = {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  cambiarActivo,
  cambiarEstadoServicio,
};
