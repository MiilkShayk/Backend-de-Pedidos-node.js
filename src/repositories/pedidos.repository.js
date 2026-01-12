// Fonte única de conexão com o banco
const { runAsync, getAsync, allAsync } = require('../database/db');

exports.criar = async (pedido) => {
  const result = await runAsync(
    `INSERT INTO pedidos (cliente, itens, total, status, user_id, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    [
      pedido.cliente,
      JSON.stringify(pedido.itens),
      pedido.total,
      pedido.status,
      pedido.user_id,
    ]
  );

  return { id: result.lastID, ...pedido };
};

exports.listar = async () => {
  const rows = await allAsync('SELECT * FROM pedidos');

  return rows.map(p => ({
    ...p,
    itens: JSON.parse(p.itens)
  }));
};

exports.listarPaginado = async ({ limit, offset, status, cliente, orderBy = 'DESC', from, to, userId }) => {
  let sql = 'SELECT * FROM pedidos WHERE 1=1';
  const params = [];

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (cliente) {
    sql += ' AND cliente LIKE ?';
    params.push(`%${cliente}%`);
  }

  if (userId) {
    sql += ' AND user_id = ?';
    params.push(userId);
  }

  // intervalo de datas (created_at)
  // usa date(created_at) pra comparar só a parte do dia
  if (from) {
    sql += ' AND date(created_at) >= date(?)';
    params.push(from);
  }
  if (to) {
    sql += ' AND date(created_at) <= date(?)';
    params.push(to);
  }

  sql += ` ORDER BY id ${orderBy} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const rows = await allAsync(sql, params);
  return rows.map(p => ({ ...p, itens: JSON.parse(p.itens) }));
};

exports.contar = async ({ status, cliente, from, to, userId }) => {
  let sql = 'SELECT COUNT(*) as total FROM pedidos WHERE 1=1';
  const params = [];

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  if (cliente) {
    sql += ' AND cliente LIKE ?';
    params.push(`%${cliente}%`);
  }

  if (userId) {
    sql += ' AND user_id = ?';
    params.push(userId);
  }

  if (from) {
    sql += ' AND date(created_at) >= date(?)';
    params.push(from);
  }

  if (to) {
    sql += ' AND date(created_at) <= date(?)';
    params.push(to);
  }

  const row = await getAsync(sql, params);
  return row.total;
};

exports.listarPorId = async (id) => {
  const row = await getAsync(
    'SELECT * FROM pedidos WHERE id = ?',
    [id]
  );

  if (!row) return null;

  return {
    ...row,
    itens: JSON.parse(row.itens)
  };
};

exports.atualizarStatus = async (id, status) => {
  await runAsync(
    'UPDATE pedidos SET status = ?, updated_at = datetime("now") WHERE id = ?',
    [status, id]
  );
};

exports.remover = async (id) => {
  await runAsync('DELETE FROM pedidos WHERE id = ?', [id]);
};

exports.limparTabela = async () => {
  await runAsync('DELETE FROM pedidos');
};

exports.resumo = async ({ from, to, cliente }) => {
  // 1) Total de pedidos + faturamento total
  let sqlBase = 'FROM pedidos WHERE 1=1';
  const params = [];

  if (cliente) {
    sqlBase += ' AND cliente LIKE ?';
    params.push(`%${cliente}%`);
  }

  if (from) {
    sqlBase += ' AND date(created_at) >= date(?)';
    params.push(from);
  }

  if (to) {
    sqlBase += ' AND date(created_at) <= date(?)';
    params.push(to);
  }

  const totalsRow = await getAsync(
    `SELECT
       COUNT(*) as totalPedidos,
       COALESCE(SUM(total), 0) as faturamentoTotal
     ${sqlBase}`,
    params
  );

  // 2) Quantidade por status (GROUP BY)
  const byStatusRows = await allAsync(
    `SELECT
       status,
       COUNT(*) as quantidade,
       COALESCE(SUM(total), 0) as faturamento
     ${sqlBase}
     GROUP BY status
     ORDER BY status ASC`,
    params
  );

  // Transformar rows em um objeto mais fácil de ler
  const porStatus = {};
  for (const row of byStatusRows) {
    porStatus[row.status] = {
      quantidade: row.quantidade,
      faturamento: row.faturamento
    };
  }

  return {
    periodo: { from: from ?? null, to: to ?? null },
    filtro: { cliente: cliente ?? null },
    totalPedidos: totalsRow.totalPedidos,
    faturamentoTotal: totalsRow.faturamentoTotal,
    porStatus
  };
};
