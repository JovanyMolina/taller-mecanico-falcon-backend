const pool = require('../config/conexionbd');

const SELECT_BASE = `
  SELECT
    q.id, q.moto_id, q.creado_por, q.estado, q.subtotal, q.total, q.observaciones, q.anticipo, q.created_at,
    m.placa AS moto_placa, m.marca AS moto_marca, m.modelo AS moto_modelo,
    c.nombre AS cliente_nombre, c.telefono AS cliente_telefono,
    u.nombre AS creado_por_nombre
  FROM cotizaciones q
  JOIN motos m ON m.id = q.moto_id
  JOIN clientes c ON c.id = m.cliente_id
  JOIN usuarios u ON u.id = q.creado_por
`;


async function crear({ moto_id, creado_por, observaciones, anticipo }, conn = pool) {
  const [result] = await conn.query(
    'INSERT INTO cotizaciones (moto_id, creado_por, observaciones, anticipo) VALUES (?, ?, ?, ?)',
    [moto_id, creado_por, observaciones || null, anticipo ?? null]
  );
  return result.insertId;
}

async function actualizarDetalles(id, { observaciones, anticipo }, conn = pool) {
  await conn.query(
    'UPDATE cotizaciones SET observaciones = ?, anticipo = ? WHERE id = ?',
    [observaciones || null, anticipo ?? null, id]
  );
}

async function actualizarTotales(id, subtotal, total, conn = pool) {
  await conn.query(
    'UPDATE cotizaciones SET subtotal = ?, total = ? WHERE id = ?',
    [subtotal, total, id]
  );
}

async function listar({ estado, busqueda, moto_id } = {}) {
  const condiciones = [];
  const params = [];

  if (estado) {
    condiciones.push('q.estado = ?');
    params.push(estado);
  }

  if (moto_id) {
    condiciones.push('q.moto_id = ?');
    params.push(moto_id);
  }

  if (busqueda) {
    const like = `%${busqueda}%`;
    condiciones.push('(m.placa LIKE ? OR c.nombre LIKE ? OR c.telefono LIKE ?)');
    params.push(like, like, like);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const [rows] = await pool.query(`${SELECT_BASE} ${where} ORDER BY q.created_at DESC`, params);
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query(`${SELECT_BASE} WHERE q.id = ?`, [id]);
  const cotizacion = rows[0];
  if (!cotizacion) return null;

  const [items] = await pool.query(
    'SELECT id, tipo, concepto, cantidad, precio_unitario, caducacion, subtotal FROM cotizacion_items WHERE cotizacion_id = ?',
    [id]
  );
  cotizacion.items = items;
  return cotizacion;
}

async function cambiarEstado(id, estado) {
  await pool.query('UPDATE cotizaciones SET estado = ? WHERE id = ?', [estado, id]);
  return buscarPorId(id);
}

module.exports = { crear, actualizarTotales, actualizarDetalles, listar, buscarPorId, cambiarEstado };