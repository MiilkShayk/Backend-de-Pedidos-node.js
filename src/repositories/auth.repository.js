const { getAsync } = require('../database/db');
const { runAsync } = require('../database/db');

exports.buscarPorEmail = async (email) => {
  const user = await getAsync(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  return user; // pode ser objeto ou undefined/null
};

exports.criarUsuario = async ({ email, passwordHash }) => {
  const result = await runAsync(
    `
    INSERT INTO users (email, password_hash)
    VALUES (?, ?)
    `,
    [email, passwordHash]
  );

  return {
    id: result.lastID,
    email
  };
};