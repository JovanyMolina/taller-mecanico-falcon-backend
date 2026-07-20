const pool = require('../config/conexionbd');

const SELECT_BASE = `
  SELECT
    o.id, o.moto_id, o.cotizacion_id, o.tecnico_asignado,
    o.fecha_inicio, o.fecha_entrega_estimada, o.fecha_entrega_real,
    o.estado, o.observaciones, o.created_at,
    m.placa AS moto_placa, m.marca AS moto_marca, m.modelo AS moto_modelo,
    c.nombre AS cliente_nombre, c.telefono AS cliente_telefono,
    t.nombre AS tecnico_nombre
  FROM ordenes_servicio o
  JOIN motos m ON m.id = o.moto_id
  JOIN clientes c ON c.id = m.cliente_id
  LEFT JOIN usuarios t ON t.id = o.tecnico_asignado
`;

async function crear({
  moto_id,
  cotizacion_id,
  tecnico_asignado,
  fecha_entrega_estimada,
  observaciones,
}) {
  const [result] = await pool.query(
    `INSERT INTO ordenes_servicio
       (moto_id, cotizacion_id, tecnico_asignado, fecha_inicio, fecha_entrega_estimada, observaciones, estado)
     VALUES (?, ?, ?, NOW(), ?, ?, 'pendiente')`,
    [
      moto_id,
      cotizacion_id || null,
      tecnico_asignado || null,
      fecha_entrega_estimada || null,
      observaciones || null,
    ]
  );
  return buscarPorId(result.insertId);
}

async function listar({ estado, busqueda } = {}) {
  const condiciones = [];
  const params = [];

  if (estado) {
    condiciones.push('o.estado = ?');
    params.push(estado);
  }

  if (busqueda) {
    const like = `%${busqueda}%`;
    condiciones.push('(m.placa LIKE ? OR c.nombre LIKE ? OR c.telefono LIKE ?)');
    params.push(like, like, like);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `${SELECT_BASE} ${where} ORDER BY o.fecha_inicio DESC`,
    params
  );
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query(`${SELECT_BASE} WHERE o.id = ?`, [id]);
  return rows[0] || null;
}

async function actualizar(id, { tecnico_asignado, fecha_entrega_estimada, observaciones }) {
  await pool.query(
    `UPDATE ordenes_servicio
     SET tecnico_asignado = ?, fecha_entrega_estimada = ?, observaciones = ?
     WHERE id = ?`,
    [tecnico_asignado || null, fecha_entrega_estimada || null, observaciones || null, id]
  );
  return buscarPorId(id);
}

async function cambiarEstado(id, estado, fecha_entrega_real) {
  if (estado === 'entregada') {
    await pool.query(
      'UPDATE ordenes_servicio SET estado = ?, fecha_entrega_real = ? WHERE id = ?',
      [estado, fecha_entrega_real, id]
    );
  } else {
    await pool.query('UPDATE ordenes_servicio SET estado = ? WHERE id = ?', [estado, id]);
  }
  return buscarPorId(id);
}

module.exports = { crear, listar, buscarPorId, actualizar, cambiarEstado };
