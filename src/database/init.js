// Fonte única de conexão com o banco
const { runAsync } = require('./db');

const criarTabelas = async () => {
  await runAsync(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT NOT NULL,
      itens TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  await runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  try {
    await runAsync(`ALTER TABLE pedidos ADD COLUMN user_id INTEGER`);
    console.log('Coluna user_id adicionada em pedidos');
  } catch (err) {
    // se a coluna já existe, o SQLite vai reclamar. A gente ignora.
  }
  try {
    await runAsync(`ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'`);
    console.log('Coluna role adicionada em users');
  } catch (err) {
    // ignora se já existe
  }


  console.log('Tabelas verificadas/criadas');
};


module.exports = criarTabelas;
