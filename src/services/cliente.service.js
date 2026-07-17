const clienteModel = require('../models/cliente.model');
const ApiError = require('../utils/ApiError');

async function crear(datos) {
  return clienteModel.crear(datos);
}

async function listar(busqueda) {
  return clienteModel.listar(busqueda);
}

async function obtenerPorId(id) {
  const cliente = await clienteModel.buscarPorId(id);
  if (!cliente) {
    throw new ApiError(404, 'Cliente no encontrado');
  }
  return cliente;
}

async function actualizar(id, datos) {
  await obtenerPorId(id);
  return clienteModel.actualizar(id, datos);
}

async function cambiarEstado(id, activo) {
  await obtenerPorId(id);
  return clienteModel.cambiarEstado(id, activo);
}

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado };
