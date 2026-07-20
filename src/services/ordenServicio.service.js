const ordenModel = require('../models/ordenServicio.model');
const cotizacionModel = require('../models/cotizacion.model');
const motocicletaService = require('./motocicleta.service');
const usuarioService = require('./usuario.service');
const ApiError = require('../utils/ApiError');

const TRANSICIONES_VALIDAS = {
  pendiente: ['en_proceso', 'cancelada'],
  en_proceso: ['terminada', 'cancelada'],
  terminada: ['entregada', 'en_proceso'],
  entregada: [],
  cancelada: [],
};

async function validarTecnico(tecnico_asignado) {
  if (!tecnico_asignado) return;
  await usuarioService.obtenerPorId(tecnico_asignado); 
}

async function validarCotizacion(cotizacion_id, moto_id) {
  if (!cotizacion_id) return;

  const cotizacion = await cotizacionModel.buscarPorId(cotizacion_id);
  if (!cotizacion) {
    throw new ApiError(404, 'Cotización no encontrada');
  }
  if (cotizacion.estado !== 'aprobada') {
    throw new ApiError(400, 'La cotización debe estar aprobada para generar una orden de servicio');
  }
  if (cotizacion.moto_id !== Number(moto_id)) {
    throw new ApiError(400, 'La cotización no corresponde a la moto indicada');
  }
}

async function crear(datos) {
  await motocicletaService.obtenerPorId(datos.moto_id); // 404 si la moto no existe
  await validarTecnico(datos.tecnico_asignado);
  await validarCotizacion(datos.cotizacion_id, datos.moto_id);

  return ordenModel.crear(datos);
}

async function listar(filtros) {
  return ordenModel.listar(filtros);
}

async function obtenerPorId(id) {
  const orden = await ordenModel.buscarPorId(id);
  if (!orden) {
    throw new ApiError(404, 'Orden de servicio no encontrada');
  }
  return orden;
}

async function actualizar(id, datos) {
  await obtenerPorId(id);
  await validarTecnico(datos.tecnico_asignado);

  return ordenModel.actualizar(id, datos);
}

async function cambiarEstado(id, nuevoEstado, fecha_entrega_real) {
  const orden = await obtenerPorId(id);

  const transicionesPermitidas = TRANSICIONES_VALIDAS[orden.estado] || [];
  if (!transicionesPermitidas.includes(nuevoEstado)) {
    throw new ApiError(400, `No se puede pasar de "${orden.estado}" a "${nuevoEstado}"`);
  }

  if (nuevoEstado === 'entregada' && !fecha_entrega_real) {
    throw new ApiError(400, 'La fecha de entrega real es obligatoria para marcar la orden como entregada');
  }

  return ordenModel.cambiarEstado(id, nuevoEstado, fecha_entrega_real);
}

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado };
