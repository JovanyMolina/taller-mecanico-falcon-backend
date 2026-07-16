const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuario.model');
const ApiError = require('../utils/ApiError');

const SALT_ROUNDS = 10;

async function crear({ nombre, email, password, rol }) {
  const existente = await usuarioModel.buscarPorEmail(email);
  if (existente) {
    throw new ApiError(409, 'Ya existe un usuario registrado con ese email');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return usuarioModel.crear({ nombre, email, passwordHash, rol });
}

async function listar(busqueda) {
  return usuarioModel.listar(busqueda);
}

async function obtenerPorId(id) {
  const usuario = await usuarioModel.buscarPorId(id);
  if (!usuario) {
    throw new ApiError(404, 'Usuario no encontrado');
  }
  return usuario;
}

async function actualizar(id, { nombre, email, rol }) {
  await obtenerPorId(id); 

  const otroConMismoEmail = await usuarioModel.buscarPorEmail(email);
  if (otroConMismoEmail && otroConMismoEmail.id !== Number(id)) {
    throw new ApiError(409, 'Ya existe otro usuario registrado con ese email');
  }

  return usuarioModel.actualizar(id, { nombre, email, rol });
}

async function cambiarEstado(id, activo) {
  await obtenerPorId(id);
  return usuarioModel.cambiarEstado(id, activo);
}

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado };
