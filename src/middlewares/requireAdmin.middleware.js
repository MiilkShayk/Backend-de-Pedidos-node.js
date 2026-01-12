const AppError = require('../errors/AppError');
const usersRepository = require('../repositories/users.repository');

module.exports = async (req, res, next) => {
  try {
    // auth.middleware já colocou req.userId
    const user = await usersRepository.buscarPorIdComRole(req.userId);

    if (!user) {
      throw new AppError('Usuário não encontrado', 401);
    }

    if (user.role !== 'admin') {
      throw new AppError('Acesso negado (admin apenas)', 403);
    }

    next();
  } catch (err) {
    next(err);
  }
};
