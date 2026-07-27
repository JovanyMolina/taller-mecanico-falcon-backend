const pool = require('../config/conexionbd');

const SELECT_BASE = `
  SELECT
    c.id, c.cliente_id, c.moto_id, c.fecha, c.hora, c.motivo, c.estado,
    c.creado_por, c.created_at,
    cl.nombre AS cliente_nombre, cl.telefono AS cliente_telefono,
    m.marca AS moto_marca, m.modelo AS moto_modelo, m.placa AS moto_placa,
    u.nombre AS creado_por_nombre
  FROM citas c
  JOIN clientes cl ON cl.id = c.cliente_id
  LEFT JOIN motos m ON m.id = c.moto_id
  JOIN usuarios u ON u.id = c.creado_por
`;

async function crear({ cliente_id, moto_id, fecha, hora, motivo, creado_por }) {
  const [result] = await pool.query(
    `INSERT INTO citas (cliente_id, moto_id, fecha, hora, motivo, creado_por)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [cliente_id, moto_id || null, fecha, hora || null, motivo || null, creado_por]
  );
  return buscarPorId(result.insertId);
}

// Filtro principal: rango de fechas (una semana), no búsqueda de texto.
async function listar({ desde, hasta, busqueda } = {}) {
  const condiciones = [];
  const params = [];

  if (desde && hasta) {
    condiciones.push('c.fecha BETWEEN ? AND ?');
    params.push(desde, hasta);
  }

  if (busqueda) {
    const like = `%${busqueda}%`;
    condiciones.push('(cl.nombre LIKE ? OR cl.telefono LIKE ?)');
    params.push(like, like);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `${SELECT_BASE} ${where} ORDER BY c.fecha, c.hora`,
    params
  );
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query(`${SELECT_BASE} WHERE c.id = ?`, [id]);
  return rows[0] || null;
}

async function actualizar(id, { moto_id, fecha, hora, motivo }) {
  await pool.query(
    'UPDATE citas SET moto_id = ?, fecha = ?, hora = ?, motivo = ? WHERE id = ?',
    [moto_id || null, fecha, hora || null, motivo || null, id]
  );
  return buscarPorId(id);
}

async function cambiarEstado(id, estado) {
  await pool.query('UPDATE citas SET estado = ? WHERE id = ?', [estado, id]);
  return buscarPorId(id);
}

module.exports = { crear, listar, buscarPorId, actualizar, cambiarEstado };
