const pool = require('../config/conexionbd');

async function contar(sql) {
  const [rows] = await pool.query(sql);
  return rows[0].total;
}

async function obtenerEstadisticas() {
  const [
    motosHoy,
    motosEnReparacion,
    serviciosPendientes,
    serviciosEnProceso,
    serviciosTerminados,
    entregadosHoy,
    usuariosActivos,
    cotizacionesPendientes,
    citasHoy,
  ] = await Promise.all([
    contar('SELECT COUNT(*) AS total FROM motos WHERE DATE(fecha_recepcion) = CURDATE()'),
    contar("SELECT COUNT(*) AS total FROM motos WHERE estado IN ('en_diagnostico', 'en_reparacion')"),
    contar("SELECT COUNT(*) AS total FROM ordenes_servicio WHERE estado = 'pendiente'"),
    contar("SELECT COUNT(*) AS total FROM ordenes_servicio WHERE estado = 'en_proceso'"),
    contar("SELECT COUNT(*) AS total FROM ordenes_servicio WHERE estado = 'terminada'"),
    contar(
      "SELECT COUNT(*) AS total FROM ordenes_servicio WHERE estado = 'entregada' AND DATE(fecha_entrega_real) = CURDATE()"
    ),
    contar('SELECT COUNT(*) AS total FROM usuarios WHERE activo = 1'),
    contar("SELECT COUNT(*) AS total FROM cotizaciones WHERE estado = 'pendiente'"),
    contar("SELECT COUNT(*) AS total FROM citas WHERE fecha = CURDATE() AND estado != 'cancelada'"),
  ]);

  return {
    motosHoy,
    motosEnReparacion,
    serviciosPendientes,
    serviciosEnProceso,
    serviciosTerminados,
    entregadosHoy,
    usuariosActivos,
    cotizacionesPendientes,
    citasHoy,
  };
}

module.exports = { obtenerEstadisticas };
