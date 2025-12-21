const pedidoService = require('../services/pedidos.service');

exports.criar = async (req, res, next) => {
  try {
    const pedido = await pedidoService.criarPedido(req.body);
    res.status(201).json({ success: true, data: pedido });
  } catch (err) {
    next(err);
  }
};

exports.listar = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;

    const resultado = await pedidoService.listarPedidos({
      page,
      limit,
      status
    });

    res.json({
      success: true,
      ...resultado
    });
  } catch (err) {
    next(err);
  }
};

exports.atualizarStatus = async (req, res, next) => {
  try {
    const pedido = await pedidoService.atualizarStatus(
      Number(req.params.id),
      req.body.status
    );
    res.json({ success: true, data: pedido });
  } catch (err) {
    next(err);
  }
};

exports.remover = async (req, res, next) => {
  try {
    await pedidoService.removerPedido(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
