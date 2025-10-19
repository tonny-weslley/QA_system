# 📋 API Schema - Halloween Quiz Backend

**Versão:** 2.0.0  
**Data:** 2025-10-19  
**Base URL:** `http://localhost:3000`

---

## 📑 Índice

1. [Autenticação](#autenticação)
2. [Perguntas](#perguntas)
3. [Respostas](#respostas)
4. [Pontuação](#pontuação)
5. [Administração](#administração)
6. [Sistema](#sistema)
7. [WebSocket](#websocket)

---

## 🔐 Autenticação

Todas as rotas protegidas requerem o header:
```
Authorization: Bearer <token-jwt>
```

---

## 1️⃣ Autenticação

### POST `/api/auth/register`

**Descrição:** Cadastra um novo usuário no sistema.

**Autenticação:** Não requerida

**Request Body:**
```json
{
  "username": "string (min: 3 caracteres)",
  "password": "string (min: 6 caracteres)",
  "role": "participant | admin (opcional, default: participant)"
}
```

**Response 201 (Success):**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "role": "participant | admin",
    "createdAt": "ISO 8601 date"
  },
  "token": "string (JWT)"
}
```

**Response 400 (Error):**
```json
{
  "error": "Username must be at least 3 characters long"
}
```
```json
{
  "error": "Password must be at least 6 characters long"
}
```
```json
{
  "error": "Username already exists"
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "secret123",
    "role": "participant"
  }'
```

---

### POST `/api/auth/login`

**Descrição:** Realiza login e retorna token JWT.

**Autenticação:** Não requerida

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response 200 (Success):**
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "role": "participant | admin",
    "createdAt": "ISO 8601 date"
  },
  "token": "string (JWT)"
}
```

**Response 401 (Error):**
```json
{
  "error": "Invalid credentials"
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "secret123"
  }'
```

---

## 2️⃣ Perguntas

### POST `/api/questions`

**Descrição:** Cria uma nova pergunta (apenas Admin).

**Autenticação:** Requerida (Admin)

**Request Body:**
```json
{
  "statement": "string (não vazio)",
  "options": [
    {
      "text": "string",
      "isCorrect": "boolean"
    }
  ],
  "difficulty": "easy | medium | hard"
}
```

**Validações:**
- Mínimo 2 opções, máximo 5
- Pelo menos 1 opção deve ser correta

**Response 201 (Success):**
```json
{
  "id": "string",
  "statement": "string",
  "options": [
    {
      "id": "string (UUID)",
      "text": "string",
      "isCorrect": "boolean"
    }
  ],
  "difficulty": "easy | medium | hard",
  "qrCodeUrl": "string (base64 data URL)",
  "isLocked": "boolean",
  "createdAt": "ISO 8601 date"
}
```

**Response 400 (Error):**
```json
{
  "error": "Statement cannot be empty"
}
```
```json
{
  "error": "Question must have between 2 and 5 options"
}
```
```json
{
  "error": "At least one option must be correct"
}
```

**Response 403 (Error):**
```json
{
  "error": "Admin access required"
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "statement": "Qual é a origem do Halloween?",
    "options": [
      {"text": "Estados Unidos", "isCorrect": false},
      {"text": "Irlanda", "isCorrect": true},
      {"text": "Brasil", "isCorrect": false}
    ],
    "difficulty": "medium"
  }'
```

---

### GET `/api/questions`

**Descrição:** Lista perguntas disponíveis. Admin vê todas, participante vê apenas não respondidas e não bloqueadas.

**Autenticação:** Requerida

**Query Parameters:** Nenhum

**Response 200 (Success):**
```json
[
  {
    "id": "string",
    "statement": "string",
    "options": [
      {
        "id": "string",
        "text": "string",
        "isCorrect": "boolean (apenas para admin)"
      }
    ],
    "difficulty": "easy | medium | hard",
    "qrCodeUrl": "string",
    "isLocked": "boolean",
    "createdAt": "ISO 8601 date"
  }
]
```

**Exemplo:**
```bash
curl -X GET http://localhost:3000/api/questions \
  -H "Authorization: Bearer <token>"
```

---

### GET `/api/questions/:id`

**Descrição:** Obtém detalhes de uma pergunta específica.

**Autenticação:** Requerida

**Path Parameters:**
- `id` (string): ID da pergunta

**Response 200 (Success):**
```json
{
  "id": "string",
  "statement": "string",
  "options": [
    {
      "id": "string",
      "text": "string",
      "isCorrect": "boolean (apenas para admin)"
    }
  ],
  "difficulty": "easy | medium | hard",
  "qrCodeUrl": "string",
  "isLocked": "boolean",
  "createdAt": "ISO 8601 date"
}
```

**Response 404 (Error):**
```json
{
  "error": "Question not found"
}
```

**Response 400 (Error - Participante):**
```json
{
  "error": "You have already answered this question"
}
```
```json
{
  "error": "This question is no longer available"
}
```

**Exemplo:**
```bash
curl -X GET http://localhost:3000/api/questions/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>"
```

---

### PUT `/api/questions/:id`

**Descrição:** Atualiza uma pergunta existente (apenas Admin).

**Autenticação:** Requerida (Admin)

**Path Parameters:**
- `id` (string): ID da pergunta

**Request Body:**
```json
{
  "statement": "string (opcional)",
  "options": [
    {
      "text": "string",
      "isCorrect": "boolean"
    }
  ],
  "difficulty": "easy | medium | hard (opcional)"
}
```

**Response 200 (Success):**
```json
{
  "id": "string",
  "statement": "string",
  "options": [
    {
      "id": "string",
      "text": "string",
      "isCorrect": "boolean"
    }
  ],
  "difficulty": "easy | medium | hard",
  "qrCodeUrl": "string",
  "isLocked": "boolean",
  "createdAt": "ISO 8601 date"
}
```

**Response 400 (Error):**
```json
{
  "error": "Question not found"
}
```

**Response 403 (Error):**
```json
{
  "error": "Admin access required"
}
```

**Exemplo:**
```bash
curl -X PUT http://localhost:3000/api/questions/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "statement": "Qual é a origem do Halloween? (Atualizado)",
    "difficulty": "hard"
  }'
```

---

### DELETE `/api/questions/:id`

**Descrição:** Deleta uma pergunta (apenas Admin).

**Autenticação:** Requerida (Admin)

**Path Parameters:**
- `id` (string): ID da pergunta

**Response 204 (Success):** Sem conteúdo

**Response 404 (Error):**
```json
{
  "error": "Question not found"
}
```

**Response 403 (Error):**
```json
{
  "error": "Admin access required"
}
```

**Exemplo:**
```bash
curl -X DELETE http://localhost:3000/api/questions/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>"
```

---

## 3️⃣ Respostas

### POST `/api/answers`

**Descrição:** Submete uma resposta para uma pergunta. Calcula pontos automaticamente e bloqueia a pergunta.

**Autenticação:** Requerida

**Request Body:**
```json
{
  "questionId": "string",
  "selectedOptionId": "string"
}
```

**Pontuação:**
- Easy: 10 pontos
- Medium: 20 pontos
- Hard: 30 pontos

**Response 201 (Success):**
```json
{
  "id": "string",
  "questionId": "string",
  "isCorrect": "boolean",
  "pointsEarned": "number (0 se errado)",
  "correctOptionId": "string (ID da opção correta)",
  "answeredAt": "ISO 8601 date"
}
```

**Response 400 (Error):**
```json
{
  "error": "Question not found"
}
```
```json
{
  "error": "This question is no longer available"
}
```
```json
{
  "error": "You have already answered this question"
}
```
```json
{
  "error": "Invalid option selected"
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/answers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "questionId": "507f1f77bcf86cd799439011",
    "selectedOptionId": "uuid-da-opcao"
  }'
```

---

### GET `/api/answers/me`

**Descrição:** Lista todas as respostas do usuário autenticado.

**Autenticação:** Requerida

**Response 200 (Success):**
```json
[
  {
    "id": "string",
    "questionId": "string",
    "isCorrect": "boolean",
    "pointsEarned": "number",
    "answeredAt": "ISO 8601 date"
  }
]
```

**Exemplo:**
```bash
curl -X GET http://localhost:3000/api/answers/me \
  -H "Authorization: Bearer <token>"
```

---

### GET `/api/answers/question/:id`

**Descrição:** Obtém estatísticas de respostas de uma pergunta específica (apenas Admin).

**Autenticação:** Requerida (Admin)

**Path Parameters:**
- `id` (string): ID da pergunta

**Response 200 (Success):**
```json
{
  "questionId": "string",
  "totalAnswers": "number",
  "correctAnswers": "number",
  "incorrectAnswers": "number",
  "answers": [
    {
      "id": "string",
      "questionId": "string",
      "userId": "string",
      "selectedOptionId": "string",
      "isCorrect": "boolean",
      "pointsEarned": "number",
      "answeredAt": "ISO 8601 date"
    }
  ]
}
```

**Response 403 (Error):**
```json
{
  "error": "Admin access required"
}
```

**Exemplo:**
```bash
curl -X GET http://localhost:3000/api/answers/question/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>"
```

---

## 4️⃣ Pontuação

### GET `/api/scores`

**Descrição:** Obtém o scoreboard (ranking). Admin vê detalhes por dificuldade, participante vê apenas total.

**Autenticação:** Requerida

**Response 200 (Success - Participante):**
```json
{
  "participants": [
    {
      "rank": "number",
      "username": "string",
      "totalPoints": "number"
    }
  ]
}
```

**Response 200 (Success - Admin):**
```json
{
  "participants": [
    {
      "rank": "number",
      "username": "string",
      "totalPoints": "number"
    }
  ],
  "adminView": [
    {
      "rank": "number",
      "username": "string",
      "totalPoints": "number",
      "easyPoints": "number",
      "mediumPoints": "number",
      "hardPoints": "number"
    }
  ]
}
```

**Exemplo:**
```bash
curl -X GET http://localhost:3000/api/scores \
  -H "Authorization: Bearer <token>"
```

---

### GET `/api/scores/me`

**Descrição:** Obtém a pontuação do usuário autenticado.

**Autenticação:** Requerida

**Response 200 (Success):**
```json
{
  "userId": "string",
  "username": "string",
  "easyPoints": "number",
  "mediumPoints": "number",
  "hardPoints": "number",
  "totalPoints": "number",
  "updatedAt": "ISO 8601 date"
}
```

**Exemplo:**
```bash
curl -X GET http://localhost:3000/api/scores/me \
  -H "Authorization: Bearer <token>"
```

---

## 5️⃣ Administração

### POST `/api/admin/reset-questions`

**Descrição:** Desbloqueia todas as perguntas (apenas Admin).

**Autenticação:** Requerida (Admin)

**Request Body:** Nenhum

**Response 200 (Success):**
```json
{
  "message": "All questions have been unlocked",
  "unlockedCount": "number"
}
```

**Response 403 (Error):**
```json
{
  "error": "Admin access required"
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/admin/reset-questions \
  -H "Authorization: Bearer <token>"
```

---

### POST `/api/admin/reset-scores`

**Descrição:** Zera a pontuação de todos os usuários (apenas Admin).

**Autenticação:** Requerida (Admin)

**Request Body:** Nenhum

**Response 200 (Success):**
```json
{
  "message": "All scores have been reset"
}
```

**Response 403 (Error):**
```json
{
  "error": "Admin access required"
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/admin/reset-scores \
  -H "Authorization: Bearer <token>"
```

---

### POST `/api/admin/finalize-event`

**Descrição:** Finaliza o evento, bloqueando todas as perguntas e retornando o scoreboard final (apenas Admin).

**Autenticação:** Requerida (Admin)

**Request Body:** Nenhum

**Response 200 (Success):**
```json
{
  "message": "Event finalized successfully",
  "finalScoreboard": [
    {
      "rank": "number",
      "username": "string",
      "totalPoints": "number",
      "easyPoints": "number",
      "mediumPoints": "number",
      "hardPoints": "number"
    }
  ],
  "totalQuestions": "number",
  "totalParticipants": "number"
}
```

**Response 403 (Error):**
```json
{
  "error": "Admin access required"
}
```

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/admin/finalize-event \
  -H "Authorization: Bearer <token>"
```

---

### GET `/api/admin/dashboard`

**Descrição:** Obtém estatísticas completas do sistema (apenas Admin).

**Autenticação:** Requerida (Admin)

**Response 200 (Success):**
```json
{
  "totalQuestions": "number",
  "lockedQuestions": "number",
  "availableQuestions": "number",
  "totalAnswers": "number",
  "totalParticipants": "number",
  "totalAdmins": "number",
  "topScores": [
    {
      "username": "string",
      "totalPoints": "number",
      "rank": "number"
    }
  ],
  "questionStats": [
    {
      "questionId": "string",
      "statement": "string",
      "difficulty": "easy | medium | hard",
      "totalAnswers": "number",
      "correctAnswers": "number",
      "isLocked": "boolean"
    }
  ]
}
```

**Response 403 (Error):**
```json
{
  "error": "Admin access required"
}
```

**Exemplo:**
```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer <token>"
```

---

## 6️⃣ Sistema

### GET `/healthz`

**Descrição:** Verifica o status do servidor.

**Autenticação:** Não requerida

**Response 200 (Success):**
```json
{
  "status": "ok",
  "timestamp": "ISO 8601 date"
}
```

**Exemplo:**
```bash
curl -X GET http://localhost:3000/healthz
```

---

## 7️⃣ WebSocket

### Conexão

**URL:** `ws://localhost:3000` ou `http://localhost:3000` (Socket.io)

**Autenticação:**
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: '<jwt-token>'
  }
});
```

---

### Eventos do Cliente → Servidor

Nenhum evento customizado implementado (apenas conexão/desconexão).

---

### Eventos do Servidor → Cliente

#### `scoreboard:update`

**Descrição:** Emitido quando o scoreboard é atualizado.

**Sala:** `scoreboard` (todos os usuários)

**Payload:**
```json
{
  "participants": [
    {
      "rank": "number",
      "username": "string",
      "totalPoints": "number"
    }
  ]
}
```

---

#### `question:locked`

**Descrição:** Emitido quando uma pergunta é bloqueada.

**Sala:** `scoreboard` (todos os usuários)

**Payload:**
```json
{
  "questionId": "string"
}
```

---

#### `answer:new`

**Descrição:** Emitido quando uma nova resposta é submetida (apenas admin).

**Sala:** `admin` (apenas admins)

**Payload:**
```json
{
  "questionId": "string",
  "userId": "string",
  "isCorrect": "boolean"
}
```

---

#### `event:finalized`

**Descrição:** Emitido quando o evento é finalizado.

**Sala:** Todos

**Payload:**
```json
{
  "message": "Event finalized successfully",
  "finalScoreboard": [...]
}
```

---

## 📝 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Sucesso sem retorno de conteúdo |
| 400 | Bad Request - Erro de validação |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Erro no servidor |

---

## 🔒 Segurança

### Rate Limiting
- **Limite:** 100 requisições por 15 minutos por IP
- **Aplicado em:** Todas as rotas `/api/*`

### CORS
- **Origem permitida:** Configurável via `CORS_ORIGIN` (.env)
- **Credenciais:** Habilitadas

### Headers de Segurança (Helmet)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security

---

## 📚 Documentação Adicional

- **Swagger UI:** http://localhost:3000/api-docs
- **README:** `/back/README.md`
- **FRD:** `/back/docs/backend-frd.md`
- **CHANGE REPORT:** `/back/docs/CHANGE_REPORT_FINAL.md`

---

**Documento criado por:** backend-node-clean-arch  
**Data:** 2025-10-19  
**Versão:** 2.0.0
