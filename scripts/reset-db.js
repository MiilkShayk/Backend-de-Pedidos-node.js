const { runAsync } = require('../src/database/db');

(async () => {
  await runAsync('DELETE FROM pedidos');
  await runAsync("DELETE FROM sqlite_sequence WHERE name='pedidos'");
  console.log('Tabela pedidos limpa com sucesso');
  process.exit();
})();
