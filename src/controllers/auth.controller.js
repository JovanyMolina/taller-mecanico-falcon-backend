const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { usuario, token } = await authService.login(email, password);

  res.status(200).json({
    success: true,
    data: { usuario, token },
  });
});

module.exports = { login };
