const express = require('express');
const router = express.Router();

const controller = require('../controllers/pedidos.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireAdmin = require('../middlewares/requireAdmin.middleware');

router.use(authMiddleware);

//só admin
router.get('/resumo', requireAdmin, controller.resumo);

//qualquer usuário logado
router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.listarPorId);
router.put('/:id', controller.atualizarStatus);
router.delete('/:id', controller.remover);

module.exports = router;