const pedidosService = require('../services/pedidos.service');

exports.criar = async (req, res, next) => {
  try {
    const pedido = await pedidosService.criarPedido(req.body, req.userId);
    res.status(201).json({ success: true, data: pedido });
  } catch (err) {
    next(err);
  }
};

exports.listar = async (req, res, next) => {
  try {
    const { page, limit, status, cliente, order, from, to } = req.query;

    const resultado = await pedidosService.listarPedidos({
      page,
      limit,
      status,
      cliente,
      order,
      from,
      to,
      userId: req.userId
    });

    res.json({
      success: true,
      ...resultado
    });
  } catch (err) {
    next(err);
  }
};

exports.listarPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const pedido = await pedidosService.listarPorId(id, req.userId);
    res.json({ success: true, data: pedido });
  } catch (err) {
    next(err);
  }
};

exports.atualizarStatus = async (req, res, next) => {
  try {
    const pedido = await pedidosService.atualizarStatus(
      Number(req.params.id),
      req.body.status,
      req.userId
    );
    res.json({ success: true, data: pedido });
  } catch (err) {
    next(err);
  }
};

exports.remover = async (req, res, next) => {
  try {
    await pedidosService.removerPedido(Number(req.params.id), req.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
exports.resumo = async (req, res, next) => {
  try {
    const { from, to, cliente } = req.query;

    const resultado = await pedidosService.resumoPedidos({ from, to, cliente });

    res.json({ success: true, ...resultado });
  } catch (err) {
    next(err);
  }
};

