const pool = require('../config/conexionbd');

async function crear({ cotizacion_id, tipo, concepto, cantidad, precio_unitario, subtotal, caducacion }, conn = pool) {
  await conn.query(
    `INSERT INTO cotizacion_items
       (cotizacion_id, tipo, concepto, cantidad, precio_unitario, caducacion, subtotal)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [cotizacion_id, tipo, concepto, cantidad || 1, precio_unitario, caducacion || null, subtotal]
  );
}

async function eliminarPorCotizacion(cotizacion_id, conn = pool) {
  await conn.query('DELETE FROM cotizacion_items WHERE cotizacion_id = ?', [cotizacion_id]);
}

module.exports = { crear, eliminarPorCotizacion };