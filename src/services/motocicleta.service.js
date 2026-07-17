const motocicletaModel = require('../models/motocicleta.model');
const clienteService = require('./cliente.service');
const ApiError = require('../utils/ApiError');

async function validarPlacaDisponible(placa, idExcluido = null) {
  if (!placa) return; 

  const existente = await motocicletaModel.buscarPorPlaca(placa);
  if (existente && existente.id !== Number(idExcluido)) {
    throw new ApiError(409, 'Ya existe una motocicleta registrada con esa placa');
  }
}

async function crear(datos) {
  await clienteService.obtenerPorId(datos.cliente_id); 
  await validarPlacaDisponible(datos.placa);

  return motocicletaModel.crear(datos);
}

async function listar(busqueda) {
  return motocicletaModel.listar(busqueda);
}

async function obtenerPorId(id) {
  const moto = await motocicletaModel.buscarPorId(id);
  if (!moto) {
    throw new ApiError(404, 'Motocicleta no encontrada');
  }
  return moto;
}

async function actualizar(id, datos) {
  await obtenerPorId(id);
  await clienteService.obtenerPorId(datos.cliente_id);
  await validarPlacaDisponible(datos.placa, id);

  return motocicletaModel.actualizar(id, datos);
}

async function cambiarEstado(id, activo) {
  await obtenerPorId(id);
  return motocicletaModel.cambiarEstado(id, activo);
}

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado };
