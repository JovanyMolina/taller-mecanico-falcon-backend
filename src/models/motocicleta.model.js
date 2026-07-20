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

async function listar(busqueda) {
  if (busqueda) {
    const like = `%${busqueda}%`;
    const [rows] = await pool.query(
      `${SELECT_BASE}
       WHERE m.placa LIKE ? OR c.nombre LIKE ? OR c.telefono LIKE ?
       ORDER BY m.fecha_recepcion DESC`,
      [like, like, like]
    );
    return rows;
  }

  const [rows] = await pool.query(`${SELECT_BASE} ORDER BY m.fecha_recepcion DESC`);
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
