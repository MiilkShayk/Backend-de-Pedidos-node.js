# Orders API — Node.js

API REST para gerenciamento de usuários e pedidos, com autenticação via JWT, controle de acesso por perfil (role) e isolamento de dados por usuário.

---

## Tecnologias
- Node.js
- Express
- SQLite
- JWT
- bcryptjs

---

## Funcionalidades
- Autenticação baseada em JWT
- CRUD de pedidos com ownership por usuário
- Autorização por perfil (user / admin)
- Relatórios administrativos com agregações
- Validação de dados e tratamento centralizado de erros

---

## Setup

Instalação das dependências:
npm install

Variáveis de ambiente (.env):
JWT_SECRET=your-secret  
JWT_EXPIRES_IN=1h  
PORT=3000  

Execução:
npm run dev

---

## Endpoints

Auth  
POST /auth/register  
POST /auth/login  

Pedidos  
POST /pedidos  
GET /pedidos  
GET /pedidos/:id  
PUT /pedidos/:id  
DELETE /pedidos/:id  

Admin  
GET /pedidos/resumo  
GET /users  
PATCH /users/promote-by-email  

---

## Modelo de dados — Pedido

{
  "cliente": "Jhonathan",
  "itens": [
    { "nome": "Guarana", "qtd": 1 },
    { "nome": "X-salada", "qtd": 1 }
  ],
  "total": 45.5
}

---

## Observações
- O acesso aos dados é controlado na camada de serviço
- Rotas administrativas exigem privilégios elevados
- Senhas são armazenadas exclusivamente como hash seguro