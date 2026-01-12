const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError('Token não informado', 401));
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return next(new AppError('Token mal formatado', 401));
  }

  const [scheme, token] = parts;

  if (scheme !== 'Bearer') {
    return next(new AppError('Token mal formatado', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // salva o id do usuário no request
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return next(new AppError('Token inválido ou expirado', 401));
  }
};
