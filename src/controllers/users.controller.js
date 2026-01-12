const usersService = require('../services/users.service');

exports.listar = async (req, res, next) => {
  try {
    const users = await usersService.listar();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

exports.buscarPorId = async (req, res, next) => {
  try {
    const user = await usersService.buscarPorId(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
exports.promoverPorEmail = async (req, res, next) => {
  try {
    const result = await usersService.promoverPorEmail(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

