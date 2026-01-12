const AppError = require('../errors/AppError');

function erroValidacao(message, errors) {
  return new AppError(message, 400, errors);
}

exports.validarCriacaoPedido = (dados) => {
  const errors = {};

  // cliente
  if (!dados || typeof dados !== 'object') {
    throw erroValidacao('Body inválido', { body: 'Envie um JSON válido' });
  }

  if (typeof dados.cliente !== 'string' || dados.cliente.trim().length < 2) {
    errors.cliente = 'cliente deve ser um texto com pelo menos 2 caracteres';
  }

  // itens
  if (!Array.isArray(dados.itens) || dados.itens.length < 1) {
    errors.itens = 'itens deve ser um array com pelo menos 1 item';
  } else {
    // valida cada item
    dados.itens.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors[`itens[${index}]`] = 'item inválido';
        return;
      }

      if (typeof item.nome !== 'string' || item.nome.trim().length < 1) {
        errors[`itens[${index}].nome`] = 'nome do item é obrigatório';
      }

      // aceita qtd ou quantidade (pra não te travar)
      const qtdRaw = item.qtd ?? item.quantidade;
      const qtdNum = Number(qtdRaw);

      if (Number.isNaN(qtdNum) || !Number.isInteger(qtdNum) || qtdNum <= 0) {
        errors[`itens[${index}].qtd`] = 'qtd deve ser um inteiro positivo';
      }
    });
  }

  // total
  const totalNum = Number(dados.total);
  if (Number.isNaN(totalNum) || totalNum <= 0) {
    errors.total = 'total deve ser um número maior que 0';
  }

  if (Object.keys(errors).length > 0) {
    throw erroValidacao('Dados inválidos', errors);
  }

  // ✅ opcional: já devolve o body "normalizado" em tipos corretos
  return {
    ...dados,
    total: totalNum
  };
};
const STATUS_VALIDOS = ['pendente', 'preparando', 'entregue', 'cancelado'];

exports.validarAtualizacaoStatus = (status) => {
  if (typeof status !== 'string') {
    throw new AppError('Status inválido', 400, { status: 'status deve ser texto' });
  }

  const s = status.toLowerCase();

  if (!STATUS_VALIDOS.includes(s)) {
    throw new AppError('Status inválido', 400, {
      status: `status deve ser um de: ${STATUS_VALIDOS.join(', ')}`
    });
  }

  return s; // devolve normalizado
};
exports.validarId = (id) => {
  const num = Number(id);

  if (Number.isNaN(num) || !Number.isInteger(num) || num <= 0) {
    throw new AppError('ID inválido', 400, {
      id: 'ID deve ser um número inteiro positivo'
    });
  }

  return num; // devolve o id já como número
};

