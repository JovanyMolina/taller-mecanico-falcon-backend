const { Router } = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const usuarioRoutes = require('./usuario.routes');
const clienteRoutes = require('./cliente.routes');
const motocicletaRoutes = require('./motocicleta.routes');
const ordenServicioRoutes = require('./ordenServicio.routes');
const cotizacionRoutes = require('./cotizacion.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/clientes', clienteRoutes);
router.use('/motocicletas', motocicletaRoutes);
router.use('/ordenes', ordenServicioRoutes);
router.use('/cotizaciones', cotizacionRoutes);


module.exports = router;
