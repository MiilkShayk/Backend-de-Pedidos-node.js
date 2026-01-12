const express = require('express');
const criarTabelas = require('./database/init');

const app = express();

app.use(express.json());

// ROTAS
const pedidosRoutes = require('./routes/pedidos.routes');
app.use('/pedidos', pedidosRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const usersRoutes = require('./routes/users.routes');
app.use('/users', usersRoutes);



// ERROR MIDDLEWARE
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

// INICIALIZA BANCO
criarTabelas();

module.exports = app;
