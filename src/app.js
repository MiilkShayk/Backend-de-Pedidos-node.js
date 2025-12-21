const express = require('express');
const criarTabelas = require('./database/init');

const app = express();

app.use(express.json());

// ROTAS
const pedidosRoutes = require('./routes/pedidos.routes');
app.use('/pedidos', pedidosRoutes);

// ERROR MIDDLEWARE
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

// INICIALIZA BANCO
criarTabelas();

module.exports = app;
