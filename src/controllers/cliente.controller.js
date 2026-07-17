const asyncHandler = require('../utils/asyncHandler');
const clienteService = require('../services/cliente.service');

// POST /api/clientes
const crear = asyncHandler(async (req, res) => {
  const cliente = await clienteService.crear(req.body);
  res.status(201).json({ success: true, data: cliente });
});

// GET /api/clientes?q=busqueda
const listar = asyncHandler(async (req, res) => {
  const clientes = await clienteService.listar(req.query.q);
  res.status(200).json({ success: true, data: clientes });
});

// GET /api/clientes/:id
const obtenerPorId = asyncHandler(async (req, res) => {
  const cliente = await clienteService.obtenerPorId(req.params.id);
  res.status(200).json({ success: true, data: cliente });
});

// PUT /api/clientes/:id
const actualizar = asyncHandler(async (req, res) => {
  const cliente = await clienteService.actualizar(req.params.id, req.body);
  res.status(200).json({ success: true, data: cliente });
});

// PATCH /api/clientes/:id/estado
const cambiarEstado = asyncHandler(async (req, res) => {
  const cliente = await clienteService.cambiarEstado(req.params.id, req.body.activo);
  res.status(200).json({ success: true, data: cliente });
});

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado };
