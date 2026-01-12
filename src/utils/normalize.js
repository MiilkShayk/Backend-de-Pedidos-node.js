const normalizarNome = (nome) => {
  return nome
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
};

const normalizarItem = (item) => {
  const qtd = item.qtd ?? item.quantidade;

  return {
    nome: item.nome
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' '),
    qtd: Number(qtd)
  };
};

module.exports = {
  normalizarNome,
  normalizarItem
};
