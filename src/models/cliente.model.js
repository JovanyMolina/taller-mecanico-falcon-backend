const pool = require('../config/conexionbd');

async function crear({ nombre, telefono, email, direccion }, conn = pool) {
  const [result] = await conn.query(
    'INSERT INTO clientes (nombre, telefono, email, direccion) VALUES (?, ?, ?, ?)',
    [nombre, telefono, email || null, direccion || null]
  );
  return buscarPorId(result.insertId, conn);
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

async function buscarPorId(id, conn = pool) {
  const [rows] = await conn.query('SELECT * FROM clientes WHERE id = ?', [id]);
  return rows[0] || null;
}

async function actualizar(id, { nombre, telefono, email, direccion }) {
  await pool.query(
    'UPDATE clientes SET nombre = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?',
    [nombre, telefono, email || null, direccion || null, id]
  );
  return buscarPorId(id);
}

async function buscarPorTelefono(telefono, conn = pool) {
  const [rows] = await conn.query('SELECT id, nombre FROM clientes WHERE telefono = ?', [telefono]);
  return rows[0] || null;
}
async function cambiarEstado(id, activo) {
  await pool.query('UPDATE clientes SET activo = ? WHERE id = ?', [activo, id]);
  return buscarPorId(id);
}

module.exports = { crear, listar, buscarPorId, buscarPorTelefono, actualizar, cambiarEstado };
