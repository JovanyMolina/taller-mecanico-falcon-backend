const pool = require('../config/conexionbd');

async function crear({ moto_id, url_imagen, descripcion }) {
  const [result] = await pool.query(
    'INSERT INTO moto_evidencias (moto_id, url_imagen, descripcion) VALUES (?, ?, ?)',
    [moto_id, url_imagen, descripcion || null]
  );
  return buscarPorId(result.insertId);
}

async function listarPorMoto(moto_id) {
  const [rows] = await pool.query(
    'SELECT id, moto_id, url_imagen, descripcion, created_at FROM moto_evidencias WHERE moto_id = ? ORDER BY created_at',
    [moto_id]
  );
  return rows;
}

async function buscarPorId(id) {
  const [rows] = await pool.query('SELECT * FROM moto_evidencias WHERE id = ?', [id]);
  return rows[0] || null;
}

async function eliminar(id) {
  await pool.query('DELETE FROM moto_evidencias WHERE id = ?', [id]);
}

module.exports = { crear, listarPorMoto, buscarPorId, eliminar };
