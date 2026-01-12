const AppError = require('../errors/AppError');

function parsePositiveInt(value, fieldName, { defaultValue } = {}) {
  if (value === undefined || value === null || value === '') {
    if (defaultValue !== undefined) return defaultValue;
    return undefined;
  }

  const num = Number(value);

  if (Number.isNaN(num) || !Number.isInteger(num) || num <= 0) {
    throw new AppError(`${fieldName} deve ser um número inteiro positivo`, 400, {
      [fieldName]: `${fieldName} deve ser um número inteiro positivo`
    });
  }

  return num;
}

function parseEnum(value, fieldName, allowed, { defaultValue } = {}) {
  if (value === undefined || value === null || value === '') {
    if (defaultValue !== undefined) return defaultValue;
    return undefined;
  }

  const v = String(value).toLowerCase();

  if (!allowed.includes(v)) {
    throw new AppError(`${fieldName} inválido`, 400, {
      [fieldName]: `${fieldName} deve ser um de: ${allowed.join(', ')}`
    });
  }

  return v;
}

function parseIsoDate(value, fieldName) {
  if (value === undefined || value === null || value === '') return undefined;

  const v = String(value);
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(v);
  if (!ok) {
    throw new AppError(`${fieldName} deve estar no formato YYYY-MM-DD`, 400, {
      [fieldName]: `${fieldName} deve estar no formato YYYY-MM-DD`
    });
  }
  return v;
}

function assertFromTo(from, to) {
  if (from && to && from > to) {
    throw new AppError('from não pode ser maior que to', 400, {
      from: 'from não pode ser maior que to',
      to: 'to deve ser maior ou igual a from'
    });
  }
}

module.exports = {
  parsePositiveInt,
  parseEnum,
  parseIsoDate,
  assertFromTo
};
