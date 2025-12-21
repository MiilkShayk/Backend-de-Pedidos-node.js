const {
  validarCriacaoPedido,
  validarAtualizacaoStatus,
  validarId
} = require('../validators/pedidos.validator');

const { normalizarNome, normalizarItem } = require('../utils/normalize');
const pedidoRepository = require('../repositories/pedidos.repository');
const AppError = require('../errors/AppError');
const STATUS_VALIDOS = ['pendente', 'preparando', 'entregue', 'cancelado'];



exports.criarPedido = async (dados) => {
  validarCriacaoPedido(dados);

  return pedidoRepository.criar({
    cliente: normalizarNome(dados.cliente),
    itens: dados.itens.map(normalizarItem),
    total: dados.total,
    status: 'pendente'
  });
};

exports.listarPedidos = async ({ page = 1, limit = 10, status }) => {
  page = Number(page);
  limit = Number(limit);

  if (page < 1 || limit < 1) {
    throw new AppError('Parâmetros de paginação inválidos', 400);
  }

  if (status && !STATUS_VALIDOS.includes(status)) {
    throw new AppError('Status inválido para filtro', 400);
  }

  const offset = (page - 1) * limit;

  const [pedidos, total] = await Promise.all([
    pedidoRepository.listarPaginado({
      limit,
      offset,
      status
    }),
    pedidoRepository.contar(status)
  ]);

  return {
    data: pedidos,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

exports.atualizarStatus = async (id, status) => {
  validarId(id);
  validarAtualizacaoStatus(status);

  const pedido = await pedidoRepository.buscarPorId(id);

  if (!pedido) {
    throw new AppError('Pedido não encontrado', 404);
  }

  if (pedido.status === 'entregue') {
    throw new AppError(
      'Pedido já entregue não pode ser alterado',
      409
    );
  }

  await pedidoRepository.atualizarStatus(id, status);

  return { id, status };
};

exports.removerPedido = async (id) => {
  validarId(id);

  const pedido = await pedidoRepository.buscarPorId(id);

  if (!pedido) {
    throw new AppError('Pedido não encontrado', 404);
  }

  if (pedido.status === 'entregue') {
    throw new AppError(
      'Pedido entregue não pode ser removido',
      409
    );
  }

  await pedidoRepository.remover(id);
};