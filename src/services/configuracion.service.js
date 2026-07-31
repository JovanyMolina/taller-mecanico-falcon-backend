const path = require('path');
const fs = require('fs/promises');
const configuracionModel = require('../models/configuracion.model');
const { CARPETA_LOGOS } = require('../config/upload');
const ApiError = require('../utils/ApiError');

async function obtener() {
  const config = await configuracionModel.obtener();
  if (!config) {
    throw new ApiError(404, 'No se encontró configuración del negocio');
  }
  return config;
}

async function actualizar(datos) {
  return configuracionModel.actualizar(datos);
}

async function actualizarLogo(archivo) {
  const actual = await obtener();
  const nuevaUrl = `/uploads/logos/${archivo.filename}`;

  const actualizado = await configuracionModel.actualizarLogo(nuevaUrl);

  // Borra el logo anterior del disco para no dejar archivos huérfanos.
  // Si falla (ej. ya no existía), no debe tumbar la petición: el logo nuevo
  // ya se guardó correctamente, que es lo que importa.
  if (actual.logo_url) {
    const nombreAnterior = path.basename(actual.logo_url);
    const rutaAnterior = path.join(CARPETA_LOGOS, nombreAnterior);
    try {
      await fs.unlink(rutaAnterior);
    } catch (error) {
      console.error('No se pudo borrar el logo anterior:', error.message);
    }
  }

  return actualizado;
}

module.exports = { obtener, actualizar, actualizarLogo };
