const pool = require('../config/conexionbd');

async function crear({ nombre, telefono, email, direccion }) {
  const [result] = await pool.query(
    'INSERT INTO clientes (nombre, telefono, email, direccion) VALUES (?, ?, ?, ?)',
    [nombre, telefono, email || null, direccion || null]
  );
  return buscarPorId(result.insertId);
}

async function listar(busqueda, estado) {
  let sql = `
    SELECT *
    FROM clientes
    WHERE 1 = 1
  `;

  const params = [];

  if (busqueda) {
    sql += `
      AND (
        nombre LIKE ?
        OR telefono LIKE ?
        OR email LIKE ?
      )
    `;

    const like = `%${busqueda}%`;

    params.push(like, like, like);
  }

  if (estado === 'Activo') {
    sql += ` AND activo = 1`;
  }

  if (estado === 'Inactivo') {
    sql += ` AND activo = 0`;
  }

  sql += ` ORDER BY nombre`;

  const [rows] = await pool.query(sql, params);

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
