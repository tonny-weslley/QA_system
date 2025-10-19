# 🎃 Halloween Quiz - Backend

Backend da aplicação de perguntas e respostas temática de Halloween, desenvolvido com **Node.js**, **TypeScript**, **Express**, **MongoDB** e **Clean Architecture**.

## 📋 Requisitos

- Node.js >= 18.x
- MongoDB >= 6.x
- npm ou yarn

## 🚀 Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/halloween-quiz
MONGODB_DB_NAME=halloween-quiz
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

3. **Iniciar MongoDB:**
```bash
# Se estiver usando Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou inicie o MongoDB localmente
mongod
```

## 🏃 Executar

### Modo Desenvolvimento
```bash
npm run dev
```

### Modo Produção
```bash
npm run build
npm start
```

### Executar Testes
```bash
npm test
npm run test:watch
npm run test:coverage
```

### Lint e Formatação
```bash
npm run lint
npm run lint:fix
npm run format
```

## 📚 Documentação

### Swagger
Acesse a documentação interativa da API em:
```
http://localhost:3000/api-docs
```

### Health Check
```
http://localhost:3000/healthz
```

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com as seguintes camadas:

```
src/
├── domain/              # Entidades e interfaces (regras de negócio)
│   ├── entities/
│   └── interfaces/
├── usecases/            # Casos de uso (regras de aplicação)
│   ├── user/
│   ├── question/
│   ├── answer/
│   ├── score/
│   └── admin/
├── infra/               # Implementações de infraestrutura
│   ├── database/
│   ├── auth/
│   └── websocket/
├── interfaces/          # Controllers, rotas e middlewares
│   ├── controllers/
│   ├── routes/
│   └── middlewares/
├── config/              # Configurações
└── main.ts              # Entry point
```

## 📊 Endpoints Implementados

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login

### Perguntas
- `POST /api/questions` - Criar pergunta (Admin)
- `GET /api/questions` - Listar perguntas
- `GET /api/questions/:id` - Obter pergunta por ID
- `PUT /api/questions/:id` - Atualizar pergunta (Admin)
- `DELETE /api/questions/:id` - Deletar pergunta (Admin)

### Respostas
- `POST /api/answers` - Responder pergunta
- `GET /api/answers/me` - Minhas respostas
- `GET /api/answers/question/:id` - Respostas da pergunta (Admin)

### Pontuação
- `GET /api/scores` - Scoreboard
- `GET /api/scores/me` - Meu score

### Administração
- `POST /api/admin/reset-questions` - Desbloquear todas as perguntas (Admin)
- `POST /api/admin/reset-scores` - Zerar pontuação (Admin)
- `POST /api/admin/finalize-event` - Finalizar evento (Admin)
- `GET /api/admin/dashboard` - Dashboard com estatísticas (Admin)

### Sistema
- `GET /healthz` - Health check

## 🔐 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação. Após login ou cadastro, você receberá um token que deve ser enviado no header:

```
Authorization: Bearer <seu-token-jwt>
```

### Roles
- **participant**: Usuário padrão, pode responder perguntas
- **admin**: Pode criar/editar/deletar perguntas e acessar dashboard

## 🧪 Testes

O projeto usa **Jest** para testes unitários. Cobertura mínima exigida: 80%.

```bash
npm test                 # Executar todos os testes
npm run test:watch       # Modo watch
npm run test:coverage    # Relatório de cobertura
```

## 📝 Status da Implementação

### ✅ Fase 1: Setup e Infraestrutura
- [x] Configurar TypeScript + Express
- [x] Configurar ESLint + Prettier
- [x] Configurar Jest
- [x] Configurar MongoDB connection
- [x] Configurar variáveis de ambiente
- [x] Criar estrutura Clean Architecture
- [x] Configurar Swagger

### ✅ Fase 2: Domain Layer
- [x] Criar entidade User
- [x] Criar entidade Question
- [x] Criar entidade Answer
- [x] Criar entidade Score
- [x] Definir interfaces de repositórios

### ✅ Fase 3: Autenticação
- [x] Implementar UseCase: RegisterUser
- [x] Implementar UseCase: LoginUser
- [x] Implementar JWTService
- [x] Implementar middleware de autenticação
- [x] Implementar middleware de autorização admin
- [x] Criar controller de autenticação
- [x] Criar rotas de autenticação
- [x] Documentar endpoints no Swagger

### ✅ Fase 4: Perguntas
- [x] Implementar UseCase: CreateQuestion
- [x] Implementar UseCase: ListQuestions
- [x] Implementar UseCase: GetQuestionById
- [x] Implementar UseCase: UpdateQuestion
- [x] Implementar UseCase: DeleteQuestion
- [x] Implementar geração de QR Code
- [x] Implementar QuestionRepository (MongoDB)
- [x] Criar controller de perguntas
- [x] Criar rotas de perguntas
- [x] Documentar endpoints no Swagger

### ✅ Fase 5: Respostas
- [x] Implementar UseCase: SubmitAnswer
- [x] Implementar UseCase: GetUserAnswers
- [x] Implementar UseCase: GetQuestionAnswers
- [x] Implementar lógica de bloqueio de pergunta
- [x] Implementar cálculo de pontos
- [x] Implementar AnswerRepository (MongoDB)
- [x] Criar controller de respostas
- [x] Criar rotas de respostas
- [x] Documentar endpoints no Swagger

### ✅ Fase 6: Pontuação
- [x] Implementar UseCase: GetScoreboard
- [x] Implementar UseCase: GetUserScore
- [x] Implementar ScoreRepository (MongoDB)
- [x] Criar controller de pontuação
- [x] Criar rotas de pontuação
- [x] Documentar endpoints no Swagger

### ✅ Fase 7: Administração
- [x] Implementar UseCase: ResetQuestions
- [x] Implementar UseCase: ResetScores
- [x] Implementar UseCase: FinalizeEvent
- [x] Implementar UseCase: GetDashboard
- [x] Criar controller de administração
- [x] Criar rotas de administração
- [x] Documentar endpoints no Swagger

### ✅ Fase 8: WebSocket
- [x] Configurar Socket.io server
- [x] Implementar autenticação WebSocket
- [x] Implementar eventos em tempo real
- [x] Integrar com HTTP server

### ✅ Fase 9: Segurança e Performance
- [x] Implementar rate limiting
- [x] Configurar helmet (segurança HTTP)
- [x] Lazy initialization de repositórios
- [x] Graceful shutdown

### ✅ Fase 10: Documentação
- [x] README completo
- [x] Swagger completo
- [x] Testes de exemplo
- [x] CHANGE REPORT

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Socket.io** - WebSocket para tempo real
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **QRCode** - Geração de QR codes
- **Helmet** - Segurança HTTP headers
- **Rate Limiting** - Proteção contra abuso
- **Swagger** - Documentação da API
- **Jest** - Framework de testes
- **ESLint + Prettier** - Qualidade de código

## 📞 Suporte

Para problemas ou dúvidas:
- Consultar `/back/docs/troubleshooting/`
- Registrar issues no repositório

## 📄 Licença

MIT

---

**Desenvolvido com 🎃 pelo agente backend-node-clean-arch**
