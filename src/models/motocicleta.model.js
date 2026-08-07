const pool = require('../config/conexionbd');

const SELECT_BASE = `
  SELECT
    m.id, m.cliente_id, m.marca, m.modelo, m.anio, m.placa, m.color, m.activo,
    m.kilometraje, m.falla_reportada, m.fecha_recepcion, m.estado, m.recibido_por,
    m.created_at, m.updated_at,
    c.nombre AS cliente_nombre, c.telefono AS cliente_telefono,
    u.nombre AS recibido_por_nombre
  FROM motos m
  JOIN clientes c ON c.id = m.cliente_id
  LEFT JOIN usuarios u ON u.id = m.recibido_por
`;

async function crear({
  cliente_id,
  marca,
  modelo,
  anio,
  placa,
  color,
  kilometraje,
  falla_reportada,
  recibido_por,
}) {
  const [result] = await pool.query(
    `INSERT INTO motos
       (cliente_id, marca, modelo, anio, placa, color, kilometraje, falla_reportada, recibido_por)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      cliente_id,
      marca,
      modelo,
      anio || null,
      placa || null,
      color || null,
      kilometraje || null,
      falla_reportada || null,
      recibido_por || null,
    ]
  );
  return buscarPorId(result.insertId);
}

async function listar({ estado, busqueda, cliente_id } = {}) {
  const condiciones = [];
  const params = [];

  if (estado) {
    condiciones.push('m.estado = ?');
    params.push(estado);
  }

  if (cliente_id) {
    condiciones.push('m.cliente_id = ?');
    params.push(cliente_id);
  }

  if (busqueda) {
    const like = `%${busqueda}%`;
    condiciones.push('(m.placa LIKE ? OR c.nombre LIKE ? OR c.telefono LIKE ?)');
    params.push(like, like, like);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `${SELECT_BASE} ${where} ORDER BY m.fecha_recepcion DESC`,
    params
  );
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query(`${SELECT_BASE} WHERE m.id = ?`, [id]);
  return rows[0] || null;
}

async function buscarPorPlaca(placa) {
  const [rows] = await pool.query('SELECT id FROM motos WHERE placa = ?', [placa]);
  return rows[0] || null;
}

async function actualizar(id, {
  cliente_id,
  marca,
  modelo,
  anio,
  placa,
  color,
  kilometraje,
  falla_reportada,
  recibido_por,
}) {
  await pool.query(
    `UPDATE motos
     SET cliente_id = ?, marca = ?, modelo = ?, anio = ?, placa = ?, color = ?,
         kilometraje = ?, falla_reportada = ?, recibido_por = ?
     WHERE id = ?`,
    [
      cliente_id,
      marca,
      modelo,
      anio || null,
      placa || null,
      color || null,
      kilometraje || null,
      falla_reportada || null,
      recibido_por || null,
      id,
    ]
  );
  return buscarPorId(id);
}

async function cambiarActivo(id, activo) {
  await pool.query('UPDATE motos SET activo = ? WHERE id = ?', [activo, id]);
  return buscarPorId(id);
}

async function cambiarEstadoServicio(id, estado) {
  await pool.query('UPDATE motos SET estado = ? WHERE id = ?', [estado, id]);
  return buscarPorId(id);
}

module.exports = {
  crear,
  listar,
  buscarPorId,
  buscarPorPlaca,
  actualizar,
  cambiarActivo,
  cambiarEstadoServicio,
};
