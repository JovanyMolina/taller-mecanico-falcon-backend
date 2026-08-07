const clienteModel = require('../models/cliente.model');
const motocicletaModel = require('../models/motocicleta.model');
const cotizacionModel = require('../models/cotizacion.model');
const ordenModel = require('../models/ordenServicio.model');
const motoEvidenciaModel = require('../models/motoEvidencia.model');
const ApiError = require('../utils/ApiError');

async function validarTelefonoDisponible(telefono, idExcluido = null) {
  const existente = await clienteModel.buscarPorTelefono(telefono);
  if (existente && existente.id !== Number(idExcluido)) {
    throw new ApiError(409, `Ese teléfono ya pertenece a ${existente.nombre}`);
  }
}

async function crear(datos) {
  await validarTelefonoDisponible(datos.telefono);
  return clienteModel.crear(datos);
}

async function listar(busqueda, estado) {
  return clienteModel.listar(busqueda, estado);
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
  await validarTelefonoDisponible(datos.telefono, id);
  return clienteModel.actualizar(id, datos);
}

async function cambiarEstado(id, activo) {
  await obtenerPorId(id);
  return clienteModel.cambiarEstado(id, activo);
}

async function obtenerHistorial(id) {
  const cliente = await obtenerPorId(id);
  const motos = await motocicletaModel.listar({ cliente_id: id });

  const motosConHistorial = await Promise.all(
    motos.map(async (moto) => {
      const [cotizaciones, ordenes, evidencias] = await Promise.all([
        cotizacionModel.listar({ moto_id: moto.id }),
        ordenModel.listar({ moto_id: moto.id }),
        motoEvidenciaModel.listarPorMoto(moto.id),
      ]);
      return { ...moto, cotizaciones, ordenes, evidencias };
    })
  );

  return { cliente, motos: motosConHistorial };
}

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado, obtenerHistorial };
