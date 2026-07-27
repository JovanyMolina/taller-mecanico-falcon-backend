const dashboardModel = require('../models/dashboard.model');

async function obtenerEstadisticas() {
  return dashboardModel.obtenerEstadisticas();
}

module.exports = { obtenerEstadisticas };
