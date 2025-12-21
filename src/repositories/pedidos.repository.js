const { runAsync, getAsync, allAsync } = require('../database/db.helper');

exports.criar = async (pedido) => {
  const result = await runAsync(
    `INSERT INTO pedidos (cliente, itens, total, status)
     VALUES (?, ?, ?, ?)`,
    [
      pedido.cliente,
      JSON.stringify(pedido.itens),
      pedido.total,
      pedido.status
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

exports.listarPaginado = async ({ limit, offset, status }) => {
  let sql = `
    SELECT * FROM pedidos
  `;
  const params = [];

  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }

  sql += `
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;

  params.push(limit, offset);

  const pedidos = await allAsync(sql, params);

  return pedidos.map(p => ({
    ...p,
    itens: JSON.parse(p.itens)
  }));
};

exports.contar = async (status) => {
  let sql = 'SELECT COUNT(*) as total FROM pedidos';
  const params = [];

  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }

  const row = await getAsync(sql, params);
  return row.total;
};

exports.buscarPorId = async (id) => {
  return getAsync('SELECT * FROM pedidos WHERE id = ?', [id]);
};

exports.atualizarStatus = async (id, status) => {
  await runAsync(
    'UPDATE pedidos SET status = ? WHERE id = ?',
    [status, id]
  );
};

exports.remover = async (id) => {
  await runAsync('DELETE FROM pedidos WHERE id = ?', [id]);
};

exports.limparTabela = async () => {
  await runAsync('DELETE FROM pedidos');
};