# 💰 Easy Finance API

API RESTful para gerenciamento financeiro pessoal, desenvolvida em **Node.js**, **Express**, **Sequelize** e **MySQL**, com autenticação JWT, arquitetura em camadas e suíte completa de testes automatizados usando **Jest + Supertest**.

---

## 🚀 Tecnologias Utilizadas

- **Node.js + Express** – Servidor e roteamento
- **Sequelize ORM** – Modelagem e comunicação com MySQL
- **MySQL** – Banco de dados relacional
- **JWT** – Autenticação baseada em tokens
- **bcryptjs** – Hash de senhas
- **dotenv** – Variáveis de ambiente
- **Jest + Supertest** – Testes automatizados (integração)
- **Swagger UI** – Documentação interativa

---

## ⚙️ Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/easy-finance.git
cd easy-finance
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz:

```
# Banco de Dados
DB_HOST=localhost
DB_USER=easyfinance_user
DB_PASSWORD=sua_senha
DB_NAME=easyfinancedb
DB_PORT=3306

# JWT
JWT_SECRET=sua_chave_secreta
JWT_EXPIRATION=1h

# App
PORT=3000
NODE_ENV=development

# Gemini API
GEMINI_API_KEY=sua_chave_api_gemini
```

E para testes, existe também:

```
.env.test
```

---

## ▶️ Iniciar o servidor

```bash
npm start
```

A aplicação subirá em:

```
http://localhost:3000
```

---

## 📖 Documentação Swagger

Acesse:

```
http://localhost:3000/api-docs
```

Permite testar todos os endpoints diretamente pelo navegador.

---

## 🔐 Autenticação JWT

Exemplo de login:

```json
{
  "email": "usuario@test.com",
  "senha": "123456"
}
```

Após o login:

1. Copie o token retornado
2. Clique em **Authorize** no Swagger
3. Cole como:

```
Bearer <seu_token_aqui>
```

Agora todas as rotas protegidas ficam acessíveis.

---

## 🧩 Endpoints Principais

### 👤 Usuários

| Método | Rota               | Descrição                     | JWT |
|--------|--------------------|-------------------------------|-----|
| POST   | /api/usuario       | Criar usuário                 | ❌  |
| POST   | /api/usuario/login | Login + retorno do token      | ❌  |
| GET    | /api/usuario/me    | Dados do próprio usuário      | ✅  |
| GET    | /api/usuario/:id   | Buscar usuário por ID         | ✅  |
| PUT    | /api/usuario/:id   | Atualizar usuário             | ✅  |
| DELETE | /api/usuario/:id   | Remover usuário               | ✅  |

---

### 📁 Categorias

| Método | Rota                   | Descrição                      | JWT |
|--------|------------------------|--------------------------------|-----|
| POST   | /api/categoria         | Criar categoria                | ✅  |
| GET    | /api/categoria         | Listar categorias              | ✅  |
| GET    | /api/categoria/:id     | Buscar categoria por ID        | ✅  |
| PUT    | /api/categoria/:id     | Atualizar categoria            | ✅  |
| DELETE | /api/categoria/:id     | Deletar categoria              | ✅  |

(Com regras para impedir acesso entre usuários diferentes.)

---

### 🧠 Lógica de Senha

- Senhas são **sempre criptografadas com bcrypt**:
  - antes de criar (`beforeCreate`)
  - antes de atualizar, caso tenha sido alterada (`beforeUpdate`)
- Login usa `bcrypt.compare` para validar credenciais

---

## 🧱 Estrutura do Projeto (real)

```
src/
├── config/
│   ├── db.js
│   └── databaseSetup.js
├── controllers/
│   ├── ArquivoMensalController.js
│   ├── CategoriaController.js
│   ├── MovimentacaoController.js
│   └── UsuarioController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   └── model.js
├── repository/
│   ├── ArquivoMensalRepository.js
│   ├── CategoriaRepository.js
│   ├── MovimentacaoRepository.js
│   └── UsuarioRepository.js
├── routes/
│   ├── ArquivoMensalRouter.js
│   ├── CategoriaRouter.js
│   ├── MovimentacaoRouter.js
│   └── UsuarioRouter.js
├── services/
│   ├── ArquivoMensalService.js
│   ├── CategoriaService.js
│   ├── MovimentacaoService.js
│   └── UsuarioService.js
├── utils/
│   └── (funções auxiliares)
├── app.js
└── server.js
```

---

## 🧪 Testes Automatizados

A suíte utiliza **Jest + Supertest**.

### Rodar testes

```bash
npm test
```

### Estrutura dos testes

```
tests/
├── utils/
│   └── testClient.js
├── categorias.test.js
├── users.test.js
└── setup.js
```

Todos os testes realizam chamadas reais à API, usando banco isolado no ambiente de teste.

---

## 🧪 Exemplos com cURL

### Login

```bash
curl -X POST http://localhost:3000/api/usuario/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "senha": "123456"}'
```

### Obter usuário autenticado

```bash
curl -X GET http://localhost:3000/api/usuario/me \
  -H "Authorization: Bearer <token>"
```

---

## ✔️ Status Atual

- ✔️ Backend padronizado  
- ✔️ Arquitetura em camadas  
- ✔️ Autenticação JWT funcional  
- ✔️ Testes 100% passando  
- ✔️ Validações completas  
- ✔️ Estrutura consistente de models + FKs  
- ✔️ Pronto para CI/CD e deploy
