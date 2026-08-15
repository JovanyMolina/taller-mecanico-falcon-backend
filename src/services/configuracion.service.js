const path = require('path');
const fs = require('fs/promises');
const os = require('os');
const configuracionModel = require('../models/configuracion.model');
const { CARPETA_LOGOS } = require('../config/upload');
const ApiError = require('../utils/ApiError');

const PUERTO_FRONTEND = 3000;

function obtenerIpLocal() {
  const interfaces = os.networkInterfaces();
  const prefijosVirtuales = ['vethernet', 'virtualbox', 'vmware', 'wsl', 'loopback'];

  for (const nombre of Object.keys(interfaces)) {
    if (prefijosVirtuales.some((p) => nombre.toLowerCase().includes(p))) continue;

    for (const dir of interfaces[nombre] || []) {
      if (dir.family === 'IPv4' && !dir.internal) {
        return dir.address;
      }
    }
  }
  return null;
}

function obtenerInfoRed() {
  const ip = obtenerIpLocal();
  return {
    ip,
    puerto: PUERTO_FRONTEND,
    url: ip ? `http://${ip}:${PUERTO_FRONTEND}` : null,
    disponible: Boolean(ip),
  };
}

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

module.exports = { obtener, actualizar, actualizarLogo, obtenerInfoRed };