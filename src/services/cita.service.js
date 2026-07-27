const citaModel = require('../models/cita.model');
const clienteService = require('./cliente.service');
const motocicletaService = require('./motocicleta.service');
const ApiError = require('../utils/ApiError');

const TRANSICIONES_VALIDAS = {
  programada: ['confirmada', 'cancelada'],
  confirmada: ['completada', 'cancelada'],
  completada: [],
  cancelada: [],
};

async function validarMoto(moto_id) {
  if (!moto_id) return;
  await motocicletaService.obtenerPorId(moto_id); // 404 si no existe
}

async function crear(datos, creado_por) {
  await clienteService.obtenerPorId(datos.cliente_id); // 404 si el cliente no existe
  await validarMoto(datos.moto_id);

  return citaModel.crear({ ...datos, creado_por });
}

async function listar(filtros) {
  return citaModel.listar(filtros);
}

async function obtenerPorId(id) {
  const cita = await citaModel.buscarPorId(id);
  if (!cita) {
    throw new ApiError(404, 'Cita no encontrada');
  }
  return cita;
}

async function actualizar(id, datos) {
  await obtenerPorId(id);
  await validarMoto(datos.moto_id);

  return citaModel.actualizar(id, datos);
}

async function cambiarEstado(id, nuevoEstado) {
  const cita = await obtenerPorId(id);

  const transicionesPermitidas = TRANSICIONES_VALIDAS[cita.estado] || [];
  if (!transicionesPermitidas.includes(nuevoEstado)) {
    throw new ApiError(400, `No se puede pasar de "${cita.estado}" a "${nuevoEstado}"`);
  }

  return citaModel.cambiarEstado(id, nuevoEstado);
}

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado };
