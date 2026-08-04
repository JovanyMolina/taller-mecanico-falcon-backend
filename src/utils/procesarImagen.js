const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const CARPETA_EVIDENCIAS = path.join(__dirname, '../../uploads/evidencias');
fs.mkdirSync(CARPETA_EVIDENCIAS, { recursive: true });

async function convertirAWebp(buffer) {
  const nombreArchivo = `evidencia-${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;
  const rutaCompleta = path.join(CARPETA_EVIDENCIAS, nombreArchivo);

  await sharp(buffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(rutaCompleta);

  return `/uploads/evidencias/${nombreArchivo}`;
}

module.exports = { convertirAWebp, CARPETA_EVIDENCIAS };
