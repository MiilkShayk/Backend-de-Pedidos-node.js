const usersRepository = require('../repositories/users.repository');
const AppError = require('../errors/AppError');

// (mínimo) validação simples de id
function validarId(id) {
  const num = Number(id);
  if (Number.isNaN(num) || !Number.isInteger(num) || num <= 0) {
    throw new AppError('ID inválido', 400, { id: 'ID deve ser um número inteiro positivo' });
  }
  return num;
}

exports.listar = async () => {
  return usersRepository.listar();
};

exports.buscarPorId = async (id) => {
  const idValido = validarId(id);

  const user = await usersRepository.buscarPorId(idValido);
  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  return user;
};
exports.promoverPorEmail = async ({ email }) => {
  if (!email || typeof email !== 'string') {
    throw new AppError('Email é obrigatório', 400, { email: 'email é obrigatório' });
  }

  const emailNormalizado = email.trim().toLowerCase();

  const user = await usersRepository.buscarPorEmail(emailNormalizado);
  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  // se já for admin, pode só retornar (ou lançar erro, você escolhe)
  if (user.role === 'admin') {
    return user;
  }

  await usersRepository.atualizarRole(user.id, 'admin');

  const atualizado = await usersRepository.buscarPorIdComRole(user.id);
  return atualizado;
};

