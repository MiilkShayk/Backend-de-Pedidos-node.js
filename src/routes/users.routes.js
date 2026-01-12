const express = require('express');
const router = express.Router();

const controller = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireAdmin = require('../middlewares/requireAdmin.middleware');

router.use(authMiddleware);

router.patch('/promote-by-email', requireAdmin, controller.promoverPorEmail);

router.get('/', requireAdmin, controller.listar);
router.get('/:id', requireAdmin, controller.buscarPorId);


module.exports = router;
