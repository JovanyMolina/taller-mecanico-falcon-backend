const pool = require('../config/conexionbd');

async function crear({ nombre, telefono, email, direccion }) {
  const [result] = await pool.query(
    'INSERT INTO clientes (nombre, telefono, email, direccion) VALUES (?, ?, ?, ?)',
    [nombre, telefono, email || null, direccion || null]
  );
  return buscarPorId(result.insertId);
}

async function listar(busqueda) {
  if (busqueda) {
    const like = `%${busqueda}%`;
    const [rows] = await pool.query(
      `SELECT * FROM clientes
       WHERE nombre LIKE ? OR telefono LIKE ? OR email LIKE ?
       ORDER BY nombre`,
      [like, like, like]
    );
    return rows;
  }

  const [rows] = await pool.query('SELECT * FROM clientes ORDER BY nombre');
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
  return rows[0] || null;
}

async function actualizar(id, { nombre, telefono, email, direccion }) {
  await pool.query(
    'UPDATE clientes SET nombre = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?',
    [nombre, telefono, email || null, direccion || null, id]
  );
  return buscarPorId(id);
}

async function cambiarEstado(id, activo) {
  await pool.query('UPDATE clientes SET activo = ? WHERE id = ?', [activo, id]);
  return buscarPorId(id);
}

module.exports = { crear, listar, buscarPorId, actualizar, cambiarEstado };
