const normalizarNome = (nome) => {
  return nome
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
};

const normalizarItem = (item) => {
  return item
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
};

module.exports = {
  normalizarNome,
  normalizarItem
};
