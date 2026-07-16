const pool = require('../config/conexionbd');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/health
const checkHealth = asyncHandler(async (req, res) => {
  await pool.query('SELECT 1');

  res.status(200).json({
    success: true,
    message: 'Servidor y base de datos operativos',
    timestamp: new Date().toISOString(),
  });
});

module.exports = { checkHealth };
