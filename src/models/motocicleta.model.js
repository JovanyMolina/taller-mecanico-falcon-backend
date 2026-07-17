const pool = require('../config/conexionbd');

const SELECT_BASE = `
  SELECT
    m.id, m.cliente_id, m.marca, m.modelo, m.anio, m.placa, m.color, m.activo,
    m.created_at, m.updated_at,
    c.nombre AS cliente_nombre, c.telefono AS cliente_telefono
  FROM motos m
  JOIN clientes c ON c.id = m.cliente_id
`;

async function crear({ cliente_id, marca, modelo, anio, placa, color }) {
  const [result] = await pool.query(
    'INSERT INTO motos (cliente_id, marca, modelo, anio, placa, color) VALUES (?, ?, ?, ?, ?, ?)',
    [cliente_id, marca, modelo, anio || null, placa || null, color || null]
  );
  return buscarPorId(result.insertId);
}

async function listar(busqueda) {
  if (busqueda) {
    const like = `%${busqueda}%`;
    const [rows] = await pool.query(
      `${SELECT_BASE}
       WHERE m.placa LIKE ? OR c.nombre LIKE ? OR c.telefono LIKE ?
       ORDER BY m.created_at DESC`,
      [like, like, like]
    );
    return rows;
  }

  const [rows] = await pool.query(`${SELECT_BASE} ORDER BY m.created_at DESC`);
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

async function actualizar(id, { cliente_id, marca, modelo, anio, placa, color }) {
  await pool.query(
    'UPDATE motos SET cliente_id = ?, marca = ?, modelo = ?, anio = ?, placa = ?, color = ? WHERE id = ?',
    [cliente_id, marca, modelo, anio || null, placa || null, color || null, id]
  );
  return buscarPorId(id);
}

async function cambiarEstado(id, activo) {
  await pool.query('UPDATE motos SET activo = ? WHERE id = ?', [activo, id]);
  return buscarPorId(id);
}

module.exports = {
  crear,
  listar,
  buscarPorId,
  buscarPorPlaca,
  actualizar,
  cambiarEstado,
};
