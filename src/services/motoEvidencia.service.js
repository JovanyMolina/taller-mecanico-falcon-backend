const path = require('path');
const fs = require('fs/promises');
const motoEvidenciaModel = require('../models/motoEvidencia.model');
const motocicletaService = require('./motocicleta.service');
const { convertirAWebp, CARPETA_EVIDENCIAS } = require('../utils/procesarImagen');
const ApiError = require('../utils/ApiError');

async function subir(moto_id, archivos) {
  await motocicletaService.obtenerPorId(moto_id); 

  if (!archivos || archivos.length === 0) {
    throw new ApiError(400, 'No se recibió ninguna imagen');
  }

  const evidencias = [];
  for (const archivo of archivos) {
    const urlImagen = await convertirAWebp(archivo.buffer);
    const evidencia = await motoEvidenciaModel.crear({ moto_id, url_imagen: urlImagen });
    evidencias.push(evidencia);
  }

  return evidencias;
}

async function listarPorMoto(moto_id) {
  await motocicletaService.obtenerPorId(moto_id);
  return motoEvidenciaModel.listarPorMoto(moto_id);
}

async function eliminar(evidenciaId, moto_id) {
  const evidencia = await motoEvidenciaModel.buscarPorId(evidenciaId);
  if (!evidencia || evidencia.moto_id !== Number(moto_id)) {
    throw new ApiError(404, 'Evidencia no encontrada');
  }

  await motoEvidenciaModel.eliminar(evidenciaId);

  const nombreArchivo = path.basename(evidencia.url_imagen);
  const rutaArchivo = path.join(CARPETA_EVIDENCIAS, nombreArchivo);
  try {
    await fs.unlink(rutaArchivo);
  } catch (error) {
    console.error('No se pudo borrar la evidencia del disco:', error.message);
  }
}

module.exports = { subir, listarPorMoto, eliminar };
