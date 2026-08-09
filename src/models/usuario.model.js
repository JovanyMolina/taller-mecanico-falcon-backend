const pool = require('../config/conexionbd');

async function buscarPorEmail(email) {
  const [rows] = await pool.query(
    'SELECT id, nombre, email, password_hash, rol, activo FROM usuarios WHERE email = ?',
    [email]
  );
  return rows[0] || null;
}

async function buscarPorId(id) {
  const [rows] = await pool.query(
    'SELECT id, nombre, email, rol, activo FROM usuarios WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function crear({ nombre, email, passwordHash, rol }) {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, passwordHash, rol]
  );
  return buscarPorId(result.insertId);
}

async function listar(busqueda) {
  if (busqueda) {
    const like = `%${busqueda}%`;
    const [rows] = await pool.query(
      `SELECT id, nombre, email, rol, activo FROM usuarios
       WHERE nombre LIKE ? OR email LIKE ?
       ORDER BY nombre`,
      [like, like]
    );
    return rows;
  }

  const [rows] = await pool.query(
    'SELECT id, nombre, email, rol, activo FROM usuarios ORDER BY nombre'
  );
  return rows;
}

async function actualizar(id, { nombre, email, rol }) {
  await pool.query(
    'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?',
    [nombre, email, rol, id]
  );
  return buscarPorId(id);
}

async function cambiarEstado(id, activo) {
  await pool.query('UPDATE usuarios SET activo = ? WHERE id = ?', [activo, id]);
  return buscarPorId(id);
}

async function listarTecnicos() {
  const [rows] = await pool.query(
    'SELECT id, nombre FROM usuarios WHERE activo = 1 ORDER BY nombre'
  );
  return rows;
}

async function eliminar(id) {
  await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
}

module.exports = {
  buscarPorEmail,
  buscarPorId,
  crear,
  listar,
  actualizar,
  cambiarEstado,
  listarTecnicos,
  eliminar,
};
