const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuario.model');
const { generarToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

async function login(email, password) {
  const usuario = await usuarioModel.buscarPorEmail(email);

  if (!usuario) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  if (!usuario.activo) {
    throw new ApiError(403, 'Este usuario está desactivado');
  }

  const passwordValido = await bcrypt.compare(password, usuario.password_hash);
  if (!passwordValido) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  const token = generarToken({
    id: usuario.id,
    rol: usuario.rol,
  });

  const { password_hash, ...usuarioSinPassword } = usuario;

  return { usuario: usuarioSinPassword, token };
}

module.exports = { login };
