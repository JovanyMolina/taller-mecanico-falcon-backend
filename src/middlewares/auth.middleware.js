const { verificarToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

function verificarAutenticacion(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Token no proporcionado');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verificarToken(token);
    req.usuario = payload;
    next();
  } catch (error) {
    throw new ApiError(401, 'Token inválido o expirado');
  }
}

module.exports = verificarAutenticacion;
