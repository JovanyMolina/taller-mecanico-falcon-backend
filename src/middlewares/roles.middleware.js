const ApiError = require('../utils/ApiError');

function verificarRol(...rolesPermitidos) {
  return function (req, res, next) {
    if (!req.usuario) {
      throw new ApiError(401, 'No autenticado');
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      throw new ApiError(403, 'No tienes permisos para realizar esta acción');
    }

    next();
  };
}

module.exports = verificarRol;
