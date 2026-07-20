const motocicletaModel = require('../models/motocicleta.model');
const clienteService = require('./cliente.service');
const usuarioService = require('./usuario.service');
const ApiError = require('../utils/ApiError');

const TRANSICIONES_VALIDAS = {
  recibida: ['en_diagnostico'],
  en_diagnostico: ['en_reparacion', 'recibida'],
  en_reparacion: ['lista', 'en_diagnostico'],
  lista: ['entregada', 'en_reparacion'],
  entregada: [],
};

async function validarPlacaDisponible(placa, idExcluido = null) {
  if (!placa) return;

  const existente = await motocicletaModel.buscarPorPlaca(placa);
  if (existente && existente.id !== Number(idExcluido)) {
    throw new ApiError(409, 'Ya existe una motocicleta registrada con esa placa');
  }
}

async function validarRecibidoPor(recibido_por) {
  if (!recibido_por) return;
  await usuarioService.obtenerPorId(recibido_por); 
}

async function crear(datos) {
  await clienteService.obtenerPorId(datos.cliente_id);
  await validarPlacaDisponible(datos.placa);
  await validarRecibidoPor(datos.recibido_por);

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
  await validarRecibidoPor(datos.recibido_por);

  return motocicletaModel.actualizar(id, datos);
}

async function cambiarActivo(id, activo) {
  await obtenerPorId(id);
  return motocicletaModel.cambiarActivo(id, activo);
}

async function cambiarEstadoServicio(id, nuevoEstado) {
  const moto = await obtenerPorId(id);

  const transicionesPermitidas = TRANSICIONES_VALIDAS[moto.estado] || [];
  if (!transicionesPermitidas.includes(nuevoEstado)) {
    throw new ApiError(400, `No se puede pasar de "${moto.estado}" a "${nuevoEstado}"`);
  }

  return motocicletaModel.cambiarEstadoServicio(id, nuevoEstado);
}

module.exports = {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  cambiarActivo,
  cambiarEstadoServicio,
};
