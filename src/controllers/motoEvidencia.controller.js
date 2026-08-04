const asyncHandler = require('../utils/asyncHandler');
const motoEvidenciaService = require('../services/motoEvidencia.service');

// POST /api/motocicletas/:id/evidencias
const subir = asyncHandler(async (req, res) => {
  const evidencias = await motoEvidenciaService.subir(req.params.id, req.files);
  res.status(201).json({ success: true, data: evidencias });
});

// GET /api/motocicletas/:id/evidencias
const listar = asyncHandler(async (req, res) => {
  const evidencias = await motoEvidenciaService.listarPorMoto(req.params.id);
  res.status(200).json({ success: true, data: evidencias });
});

// DELETE /api/motocicletas/:id/evidencias/:evidenciaId
const eliminar = asyncHandler(async (req, res) => {
  await motoEvidenciaService.eliminar(req.params.evidenciaId, req.params.id);
  res.status(200).json({ success: true, message: 'Evidencia eliminada' });
});

module.exports = { subir, listar, eliminar };
