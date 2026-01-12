const { runAsync, getAsync, allAsync } = require('../database/db');


exports.listar = async () => {
  return allAsync(
    `SELECT id, email, role, created_at, updated_at
     FROM users
     ORDER BY id ASC`
  );
};

exports.buscarPorId = async (id) => {
  return getAsync(
    `SELECT id, email, created_at, updated_at
     FROM users
     WHERE id = ?`,
    [id]
  );
};
exports.buscarPorIdComRole = async (id) => {
  return getAsync(
    `SELECT id, email, role, created_at, updated_at
     FROM users
     WHERE id = ?`,
    [id]
  );
};
exports.buscarPorEmail = async (email) => {
  return getAsync(
    `SELECT id, email, role, created_at, updated_at
     FROM users
     WHERE email = ?`,
    [email]
  );
};
exports.atualizarRole = async (id, role) => {
  await runAsync(
    `UPDATE users
     SET role = ?, updated_at = datetime('now')
     WHERE id = ?`,
    [role, id]
  );
};


