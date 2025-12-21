const AppError = require('../errors/AppError');

const STATUS_VALIDOS = ['pendente', 'preparando', 'entregue', 'cancelado'];

exports.validarCriacaoPedido = ({ cliente, itens, total }) => {
  const erros = {};

  if (typeof cliente !== 'string' || cliente.trim() === '') {
    erros.cliente = 'Nome do cliente é obrigatório';
  }

  if (!Array.isArray(itens) || itens.length === 0) {
    erros.itens = 'Pedido deve conter ao menos um item';
  } else if (itens.some(i => typeof i !== 'string' || i.trim() === '')) {
    erros.itens = 'Todos os itens devem ser strings não vazias';
  }

  if (typeof total !== 'number' || total <= 0) {
    erros.total = 'Total deve ser um número maior que zero';
  }

  if (Object.keys(erros).length > 0) {
    throw new AppError('Dados inválidos para criar pedido', 400, erros);
  }
};

exports.validarAtualizacaoStatus = (status) => {
  if (!STATUS_VALIDOS.includes(status)) {
    throw new AppError('Status inválido', 400, {
      status: `Status permitido: ${STATUS_VALIDOS.join(', ')}`
    });
  }
};

exports.validarId = (id) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError('ID inválido', 400, {
      id: 'ID deve ser um número inteiro positivo'
    });
  }
};
