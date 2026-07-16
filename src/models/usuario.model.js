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

module.exports = { buscarPorEmail, buscarPorId, crear };
