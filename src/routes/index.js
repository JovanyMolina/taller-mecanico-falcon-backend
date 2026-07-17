const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const usuarioRoutes = require('./usuario.routes');
const clienteRoutes = require('./cliente.routes');
const motocicletaRoutes = require('./motocicleta.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/clientes', clienteRoutes);
router.use('/motocicletas', motocicletaRoutes);

module.exports = router;
