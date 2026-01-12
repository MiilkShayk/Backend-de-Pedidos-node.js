const bcrypt = require('bcryptjs');
const authRepository = require('../repositories/auth.repository');
const AppError = require('../errors/AppError');
const jwt = require('jsonwebtoken');


exports.register = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError('Email e senha são obrigatórios', 400);
  }

  const usuarioExistente = await authRepository.buscarPorEmail(email);
  if (usuarioExistente) {
    throw new AppError('Email já cadastrado', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const usuario = await authRepository.criarUsuario({
    email,
    passwordHash
  });

  return usuario; // por enquanto só isso
};

exports.login = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError('Email e senha são obrigatórios', 400);
  }

  const user = await authRepository.buscarPorEmail(email);

  if (!user) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const senhaOk = await bcrypt.compare(password, user.password_hash);

  if (!senhaOk) {
    throw new AppError('Credenciais inválidas', 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT_SECRET não configurado', 500);
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  return { token };
};