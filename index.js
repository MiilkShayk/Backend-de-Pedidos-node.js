const app = require('./src/app');

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});


const errorMiddleware = require('./src/middlewares/error.middleware');

app.use(errorMiddleware);
