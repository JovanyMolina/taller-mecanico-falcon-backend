const pool = require('../config/conexionbd');

async function obtener() {
  const [rows] = await pool.query('SELECT * FROM configuracion_negocio WHERE id = 1');
  return rows[0] || null;
}

async function actualizar({ nombre, direccion, telefono, email, trabaja_domingos }) {
  await pool.query(
    'UPDATE configuracion_negocio SET nombre = ?, direccion = ?, telefono = ?, email = ?, trabaja_domingos = ? WHERE id = 1',
    [nombre, direccion || null, telefono || null, email || null, Boolean(trabaja_domingos)]
  );
  return obtener();
}

async function actualizarLogo(logoUrl) {
  await pool.query('UPDATE configuracion_negocio SET logo_url = ? WHERE id = 1', [logoUrl]);
  return obtener();
}

module.exports = { obtener, actualizar, actualizarLogo };
