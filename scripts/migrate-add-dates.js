// scripts/migrate-add-dates.js
const { runAsync, getAsync } = require('../src/database/db');

async function main() {
  // checa se a coluna existe
  const columns = await getAsync("PRAGMA table_info(pedidos)");
  // Observação: getAsync pega só 1 linha. Então vamos fazer um jeito simples:
  // (para iniciante: vamos tentar adicionar e ignorar erro se já existir)

  try {
    await runAsync("ALTER TABLE pedidos ADD COLUMN created_at TEXT");
    console.log("✅ Coluna created_at adicionada");
  } catch (e) {
    console.log("ℹ️ created_at já existe (ou não foi possível adicionar):", e.message);
  }

  try {
    await runAsync("ALTER TABLE pedidos ADD COLUMN updated_at TEXT");
    console.log("✅ Coluna updated_at adicionada");
  } catch (e) {
    console.log("ℹ️ updated_at já existe (ou não foi possível adicionar):", e.message);
  }

  // preenche pedidos antigos (se estiver null)
  await runAsync("UPDATE pedidos SET created_at = COALESCE(created_at, datetime('now'))");
  await runAsync("UPDATE pedidos SET updated_at = COALESCE(updated_at, datetime('now'))");

  console.log("✅ Datas preenchidas nos registros antigos");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migração falhou:", err);
  process.exit(1);
});
