const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
    try {
        const resultado = await authService.register(req.body);
        res.status(201).json(resultado);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
    const resultado = await authService.login(req.body);
    res.json(resultado);
    } catch (err) {
        next(err);
    }
};
exports.criar = async (req, res, next) => {
    try {
        const pedido = await pedidosService.criarPedido(req.body);
        res.status(201).json({ success: true, data: pedido });
    } catch (err) {
        next(err);
    }
};

