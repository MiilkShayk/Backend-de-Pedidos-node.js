// mock do banco de dados
jest.mock('../../database/db', () => {
  return {
    run: jest.fn(),
    get: jest.fn(),
    all: jest.fn()
  };
});

const service = require('../pedidos.service');
const AppError = require('../../errors/AppError');

describe('Pedidos Service', () => {

test('não deve remover pedido já entregue', async () => {
  const db = require('../../database/db');

  db.get.mockImplementation((query, params, callback) => {
    callback(null, { id: 1, status: 'entregue' });
  });

  await expect(
    service.removerPedido(1)
  ).rejects.toBeInstanceOf(AppError);
});

});
