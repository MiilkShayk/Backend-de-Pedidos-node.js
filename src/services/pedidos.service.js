const {
  validarCriacaoPedido,
  validarAtualizacaoStatus,
  validarId
} = require('../validators/pedidos.validator');
const {
  parsePositiveInt,
  parseEnum,
  parseIsoDate,
  assertFromTo
} = require('../utils/validation');

const { normalizarNome, normalizarItem } = require('../utils/normalize');
const pedidoRepository = require('../repositories/pedidos.repository');
const AppError = require('../errors/AppError');
const STATUS_VALIDOS = ['pendente', 'preparando', 'entregue', 'cancelado'];
const ORDER_VALIDO = ['asc', 'desc'];




exports.criarPedido = async (dados, userId) => {
  const dadosValidos = validarCriacaoPedido(dados);

  return pedidoRepository.criar({
    cliente: normalizarNome(dadosValidos.cliente),
    itens: dadosValidos.itens.map(normalizarItem),
    total: dadosValidos.total,
    status: 'pendente',
    user_id: userId
  });
};

exports.listarPedidos = async ({ page, limit, status, cliente, order, from, to, userId }) => {
  const pageNum = parsePositiveInt(page, 'page', { defaultValue: 1 });
  const limitNum = parsePositiveInt(limit, 'limit', { defaultValue: 10 });

  if (limitNum > 50) {
    throw new AppError('Limit máximo é 50', 400, { limit: 'limit máximo é 50' });
  }

  const statusVal = parseEnum(status, 'status', STATUS_VALIDOS);
  const orderVal = parseEnum(order, 'order', ORDER_VALIDO, { defaultValue: 'desc' });

  const fromDate = parseIsoDate(from, 'from');
  const toDate = parseIsoDate(to, 'to');
  assertFromTo(fromDate, toDate);

  let clienteNormalizado;
  if (cliente) clienteNormalizado = normalizarNome(cliente);

  const offset = (pageNum - 1) * limitNum;
  const orderBy = orderVal.toUpperCase(); // 'ASC'/'DESC'

  const [pedidos, total] = await Promise.all([
    pedidoRepository.listarPaginado({
      limit: limitNum,
      offset,
      status: statusVal,
      cliente: clienteNormalizado,
      orderBy,
      from: fromDate,
      to: toDate,
      userId
    }),
    pedidoRepository.contar({
      status: statusVal,
      cliente: clienteNormalizado,
      from: fromDate,
      to: toDate,
      userId
    })
  ]);

  return {
    data: pedidos,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

exports.listarPorId = async (id, userId) => {
  const idValido = validarId(id);

  const pedido = await pedidoRepository.listarPorId(idValido);

  if (!pedido) throw new AppError('Pedido não encontrado', 404);

  if (pedido.user_id !== userId) {
    throw new AppError('Acesso negado', 403);
  }

  return pedido;
};

exports.atualizarStatus = async (id, status, userId) => {
  const idValido = validarId(id);
  const statusValido = validarAtualizacaoStatus(status);

  const pedido = await pedidoRepository.listarPorId(idValido);
  if (!pedido) throw new AppError('Pedido não encontrado', 404);

  if (pedido.user_id !== userId) {
    throw new AppError('Acesso negado', 403);
  }

  if (pedido.status === 'entregue') {
    throw new AppError('Pedido já entregue não pode ser alterado', 409);
  }

  await pedidoRepository.atualizarStatus(idValido, statusValido);
  return { id: idValido, status: statusValido };
};

exports.removerPedido = async (id, userId) => {
  const idValido = validarId(id);

  const pedido = await pedidoRepository.listarPorId(idValido);
  if (!pedido) throw new AppError('Pedido não encontrado', 404);

  if (pedido.user_id !== userId) {
    throw new AppError('Acesso negado', 403);
  }

  if (pedido.status === 'entregue') {
    throw new AppError('Pedido entregue não pode ser removido', 409);
  }

  await pedidoRepository.remover(idValido);
  return { message: 'Pedido removido com sucesso', id: idValido };
};

exports.resumoPedidos = async ({ from, to, cliente }) => {
  const fromDate = parseIsoDate(from, 'from');
  const toDate = parseIsoDate(to, 'to');
  assertFromTo(fromDate, toDate);

  let clienteNormalizado;
  if (cliente) clienteNormalizado = normalizarNome(cliente);

  const resumo = await pedidoRepository.resumo({
    from: fromDate,
    to: toDate,
    cliente: clienteNormalizado
  });

  return { data: resumo };
};
