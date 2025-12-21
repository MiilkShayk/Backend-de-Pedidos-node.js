const AppError = require('../errors/AppError');

module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    errors: null
  });
};