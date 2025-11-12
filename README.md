# 💰 Easy Finance API

API RESTful para gerenciamento financeiro pessoal, desenvolvida em **Node.js**, **Express**, **Sequelize** e **MySQL**, com autenticação JWT e documentação via Swagger.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** + **Express** — Servidor e roteamento
- **Sequelize ORM** — Modelagem e integração com MySQL
- **MySQL** — Banco de dados relacional
- **JWT (JSON Web Token)** — Autenticação de usuários
- **bcrypt** — Criptografia de senhas
- **Swagger UI** — Documentação interativa da API

---

## ⚙️ Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/easy-finance.git
cd easy-finance

2. Instalar dependências

npm install

3. Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

# Banco de dados
DB_HOST=localhost
DB_USER=easyfinance_user
DB_PASSWORD=sua_senha
DB_NAME=easyfinancedb
DB_PORT=3306

# JWT
JWT_SECRET=sua_chave_secreta
JWT_EXPIRATION=1h

# Outras configurações
PORT=3000
NODE_ENV=development
```

### 4. Iniciar o servidor

npm start

A API será executada em:

    📍 http://localhost:3000

📖 Documentação Swagger

Acesse a documentação interativa em:

    👉 http://localhost:3000/api-docs

Lá você pode testar os endpoints diretamente pelo navegador, incluindo rotas protegidas com JWT.
🔐 Autenticação

A autenticação é feita via token JWT.

    Faça login com:
```
{
  "email": "seu@email.com",
  "senha": "123456"
}
```
Copie o token retornado e clique em Authorize no Swagger, inserindo:

    Bearer <seu_token_aqui>

    Assim, as rotas protegidas (como /api/usuario/me) serão acessíveis.

### 🧩 Endpoints Principais
#### 👤 Usuário
```
Método	Endpoint	Descrição	Autenticação
POST	/api/usuario	Cria um novo usuário	❌ Não requer
POST	/api/usuario/login	Realiza login e retorna token JWT	❌ Não requer
GET	/api/usuario/me	Retorna o usuário autenticado	✅ Requer JWT
GET	/api/usuario/:id	Busca usuário por ID	✅ Requer JWT
PUT	/api/usuario/:id	Atualiza dados do usuário	✅ Requer JWT
DELETE	/api/usuario/:id	Remove um usuário	✅ Requer JWT
```
### 🧠 Lógica de Senha

    Senhas são automaticamente criptografadas com bcrypt:

        Na criação (beforeCreate hook)

        Na atualização, caso o campo senha seja alterado (beforeUpdate hook)

    Durante o login, a comparação entre senha informada e senha armazenada é feita com bcrypt.compare.

### 🧰 Estrutura do Projeto
```
src/
├── config/
│   └── database.js          # Configuração do Sequelize e MySQL
├── controllers/
│   └── usuarioController.js # Lógica de CRUD e autenticação
├── middlewares/
│   └── authMiddleware.js    # Validação do token JWT
├── models/
│   └── Usuario.js           # Modelo Sequelize com hooks de hash
├── repositories/
│   └── UsuarioRepository.js # Abstração de acesso ao banco
├── routes/
│   └── usuarioRoutes.js     # Rotas REST do módulo de usuário
├── swagger/
│   └── swagger.js           # Configuração do Swagger
└── server.js                # Ponto de entrada da aplicação
```
## 🧪 Testando com cURL
### Login
```
curl -X POST http://localhost:3000/api/usuario/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "senha": "123456"}'
```
### Usuário autenticado
```
curl -X GET http://localhost:3000/api/usuario/me \
  -H "Authorization: Bearer <seu_token_jwt>"
```