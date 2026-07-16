const asyncHandler = require('../utils/asyncHandler');
const usuarioService = require('../services/usuario.service');

// POST /api/usuarios
const crear = asyncHandler(async (req, res) => {
  const usuario = await usuarioService.crear(req.body);
  res.status(201).json({ success: true, data: usuario });
});

// GET /api/usuarios?q=busqueda
const listar = asyncHandler(async (req, res) => {
  const usuarios = await usuarioService.listar(req.query.q);
  res.status(200).json({ success: true, data: usuarios });
});

// GET /api/usuarios/:id
const obtenerPorId = asyncHandler(async (req, res) => {
  const usuario = await usuarioService.obtenerPorId(req.params.id);
  res.status(200).json({ success: true, data: usuario });
});

// PUT /api/usuarios/:id
const actualizar = asyncHandler(async (req, res) => {
  const usuario = await usuarioService.actualizar(req.params.id, req.body);
  res.status(200).json({ success: true, data: usuario });
});

// PATCH /api/usuarios/:id/estado
const cambiarEstado = asyncHandler(async (req, res) => {
  const usuario = await usuarioService.cambiarEstado(req.params.id, req.body.activo);
  res.status(200).json({ success: true, data: usuario });
});

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado };
