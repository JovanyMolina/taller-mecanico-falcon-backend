const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboard.service');

// GET /api/dashboard/estadisticas
const obtenerEstadisticas = asyncHandler(async (req, res) => {
  const estadisticas = await dashboardService.obtenerEstadisticas();
  res.status(200).json({ success: true, data: estadisticas });
});

module.exports = { obtenerEstadisticas };
