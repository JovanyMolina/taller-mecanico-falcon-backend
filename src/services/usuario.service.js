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

async function actualizar(id, { nombre, email, rol }, idSolicitante) {
  await obtenerPorId(id); // valida que exista, lanza 404 si no

  // Un admin no puede quitarse su propio rol de admin — se quedaría sin acceso
  // a este mismo módulo y nadie más podría revertirlo si es el único admin.
  if (Number(id) === Number(idSolicitante) && rol !== 'admin') {
    throw new ApiError(400, 'No puedes quitarte tu propio rol de administrador');
  }

  const otroConMismoEmail = await usuarioModel.buscarPorEmail(email);
  if (otroConMismoEmail && otroConMismoEmail.id !== Number(id)) {
    throw new ApiError(409, 'Ya existe otro usuario registrado con ese email');
  }

  return usuarioModel.actualizar(id, { nombre, email, rol });
}

async function cambiarEstado(id, activo, idSolicitante) {
  await obtenerPorId(id);

  if (Number(id) === Number(idSolicitante) && !activo) {
    throw new ApiError(400, 'No puedes desactivar tu propia cuenta');
  }

  return usuarioModel.cambiarEstado(id, activo);
}

async function listarTecnicos() {
  return usuarioModel.listarTecnicos();
}

async function eliminar(id, idSolicitante) {
  await obtenerPorId(id); // 404 si no existe

  if (Number(id) === Number(idSolicitante)) {
    throw new ApiError(400, 'No puedes eliminar tu propia cuenta');
  }

  try {
    await usuarioModel.eliminar(id);
  } catch (error) {
    // El usuario tiene cotizaciones creadas (cotizaciones.creado_por es ON DELETE RESTRICT).
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      throw new ApiError(
        409,
        'No se puede eliminar: este usuario tiene historial registrado (cotizaciones, órdenes). Desactívalo en su lugar.'
      );
    }
    throw error;
  }
}

module.exports = { crear, listar, obtenerPorId, actualizar, cambiarEstado, listarTecnicos, eliminar };
