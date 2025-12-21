const { runAsync } = require('./db.helper');

const criarTabelas = async () => {
  await runAsync(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente TEXT NOT NULL,
      itens TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL
    )
  `);

  console.log('Tabela pedidos verificada/criada');
};

module.exports = criarTabelas;
