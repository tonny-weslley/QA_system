# ✅ Feature: Controle de Visualização de Perguntas

**Data:** 2025-10-19  
**Status:** ✅ **COMPLETO**

---

## 🎯 Objetivo

Permitir que administradores controlem se participantes podem ver a lista de perguntas ou se devem acessá-las apenas via QR Code.

---

## 🏗️ Arquitetura

### Backend

#### 1. Modelo de Configuração
**Arquivo:** `/back/src/domain/entities/Config.ts`
```typescript
export interface Config {
  id: string;
  key: string;
  value: boolean | string | number;
  updatedAt: Date;
}
```

#### 2. Repository
**Arquivo:** `/back/src/infrastructure/database/repositories/ConfigRepository.ts`
- `findByKey(key: string)` - Buscar configuração
- `upsert(key, value)` - Criar/atualizar configuração
- `getAll()` - Listar todas configurações

#### 3. Use Cases
- **GetConfig** - Obter valor de configuração (com defaults)
- **UpdateConfig** - Atualizar configuração
- **GetAllConfigs** - Listar todas configurações

#### 4. Controller
**Arquivo:** `/back/src/interfaces/controllers/ConfigController.ts`
- `get(key)` - GET `/api/admin/config/:key`
- `update(key, value)` - PUT `/api/admin/config/:key`
- `getAll()` - GET `/api/admin/config`

#### 5. Rotas
**Arquivo:** `/back/src/interfaces/routes/adminRoutes.ts`
```typescript
GET  /api/admin/config          // Listar todas configurações
PUT  /api/admin/config/:key     // Atualizar configuração
```

**Chave de configuração:** `questions.visible`
- `true` (padrão) - Perguntas visíveis
- `false` - Perguntas ocultas (apenas QR Code)

---

### Frontend

#### 1. API Client
**Arquivo:** `/front/src/lib/api/config.ts`
```typescript
export const configApi = {
  getAll(): Promise<ConfigResponse>
  update(key, value): Promise<void>
}
```

#### 2. Componente de Controle
**Arquivo:** `/front/src/components/organisms/QuestionsVisibilityControl/`

**Features:**
- Toggle para habilitar/desabilitar visualização
- Status visual (verde/vermelho)
- Descrição do comportamento
- Feedback de sucesso/erro

**Localização:** Dashboard Admin (`/admin`)

#### 3. QuestionCard com QR Code
**Arquivo:** `/front/src/components/organisms/QuestionCard/QuestionCard.tsx`

**Nova prop:** `showQRCode?: boolean`

Quando `true`:
- Exibe QR Code do UUID da pergunta
- Mostra ID truncado abaixo
- Tamanho: 150x150px

#### 4. AdminQuestionsPage
**Arquivo:** `/front/src/components/pages/AdminQuestionsPage/`

Cada card de pergunta mostra:
- ✅ QR Code (UUID)
- ✅ Enunciado
- ✅ Dificuldade
- ✅ Status (bloqueada/desbloqueada)
- ✅ Botões de editar/deletar

#### 5. Questions Page (Participante)
**Arquivo:** `/front/src/components/pages/Questions/Questions.tsx`

**Comportamento dinâmico:**

**Quando `questions.visible = true`:**
- Mostra lista completa de perguntas
- Grid responsivo (1/2/3 colunas)
- Botão "Responder" em cada card

**Quando `questions.visible = false`:**
- Mostra card informativo sobre QR Code
- Exibe ranking atual (top participantes)
- Botão para ver ranking completo
- Participantes devem escanear QR Code para acessar perguntas

**Admin sempre vê perguntas**, independente da configuração.

---

## 🎨 Interface do Usuário

### Dashboard Admin

```
┌─────────────────────────────────────────┐
│ 👁️ Visualização de Perguntas           │
├─────────────────────────────────────────┤
│ Status: ✅ Habilitada                   │
│ Participantes podem ver a lista         │
│                                         │
│                    [Desabilitar] ←─────┤
├─────────────────────────────────────────┤
│ ℹ️ Como funciona:                       │
│ • Habilitada: Lista visível             │
│ • Desabilitada: Apenas QR Code         │
└─────────────────────────────────────────┘
```

### Gerenciar Perguntas (Admin)

```
┌──────────────────────┐
│ 📝 Pergunta #1       │
├──────────────────────┤
│ [QR CODE]            │
│ ID: abc123...        │
├──────────────────────┤
│ Qual é a capital?    │
│ [EASY]               │
├──────────────────────┤
│ [✏️ Editar] [🗑️ Del]│
└──────────────────────┘
```

### Painel Participante (Perguntas Ocultas)

```
┌─────────────────────────────────────────┐
│ 📱 Escaneie o QR Code                   │
├─────────────────────────────────────────┤
│ As perguntas estão disponíveis apenas   │
│ via QR Code. Escaneie o código da       │
│ pergunta para responder!                │
│                                         │
│        [🏆 Ver Ranking Completo]        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🏆 Ranking Atual                        │
├─────────────────────────────────────────┤
│ 1. João Silva        150 pts           │
│ 2. Maria Santos      120 pts           │
│ 3. Pedro Costa       100 pts           │
└─────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Uso

### Para Admin:

1. **Acessar Dashboard**
   ```
   http://localhost:5173/admin
   ```

2. **Controlar Visualização**
   - Ver card "Visualização de Perguntas"
   - Clicar em "Habilitar" ou "Desabilitar"
   - Confirmação automática

3. **Gerenciar Perguntas**
   ```
   http://localhost:5173/admin/questions
   ```
   - Ver QR Code de cada pergunta
   - Imprimir/compartilhar QR Codes
   - Criar/editar/deletar perguntas

### Para Participante:

**Cenário 1: Perguntas Visíveis**
1. Acessar `/questions`
2. Ver lista completa
3. Clicar em "Responder"
4. Responder normalmente

**Cenário 2: Perguntas Ocultas**
1. Acessar `/questions`
2. Ver mensagem sobre QR Code
3. Ver ranking atual
4. Escanear QR Code físico
5. Ser redirecionado para `/questions/:id`
6. Responder pergunta

---

## 📊 Banco de Dados

### Collection: `configs`

```javascript
{
  _id: ObjectId("..."),
  key: "questions.visible",
  value: true,  // ou false
  updatedAt: ISODate("2025-10-19T12:00:00Z")
}
```

**Índice:** `{ key: 1 }` (único)

---

## 🧪 Testes

### Teste Manual - Backend

```bash
# 1. Obter todas configurações
curl http://localhost:3000/api/admin/config \
  -H "Authorization: Bearer <admin-token>"

# 2. Desabilitar visualização
curl -X PUT http://localhost:3000/api/admin/config/questions.visible \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"value": false}'

# 3. Habilitar visualização
curl -X PUT http://localhost:3000/api/admin/config/questions.visible \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"value": true}'
```

### Teste Manual - Frontend

**Como Admin:**
1. ✅ Login como admin
2. ✅ Acessar `/admin`
3. ✅ Ver controle de visualização
4. ✅ Desabilitar visualização
5. ✅ Acessar `/admin/questions`
6. ✅ Ver QR Codes nas perguntas
7. ✅ Acessar `/questions` (deve ver lista normalmente)

**Como Participante:**
1. ✅ Login como participante
2. ✅ Admin desabilita visualização
3. ✅ Acessar `/questions`
4. ✅ Ver mensagem de QR Code
5. ✅ Ver ranking
6. ✅ Escanear QR Code
7. ✅ Acessar `/questions/:uuid`
8. ✅ Responder pergunta normalmente

---

## 📝 Arquivos Criados/Modificados

### Backend (8 arquivos novos)
```
/back/src/domain/entities/Config.ts
/back/src/domain/interfaces/IConfigRepository.ts
/back/src/infrastructure/database/repositories/ConfigRepository.ts
/back/src/usecases/config/GetConfig.ts
/back/src/usecases/config/UpdateConfig.ts
/back/src/usecases/config/GetAllConfigs.ts
/back/src/interfaces/controllers/ConfigController.ts
/back/src/interfaces/routes/adminRoutes.ts (modificado)
```

### Frontend (4 arquivos novos, 3 modificados)
```
Novos:
/front/src/lib/api/config.ts
/front/src/components/organisms/QuestionsVisibilityControl/
/front/src/components/pages/AdminQuestionsPage/ (já existia)
/front/FEATURE_QUESTIONS_VISIBILITY.md

Modificados:
/front/src/components/organisms/QuestionCard/QuestionCard.tsx
/front/src/components/pages/AdminDashboardPage/AdminDashboardPage.tsx
/front/src/components/pages/Questions/Questions.tsx
```

---

## ✅ Checklist de Implementação

### Backend
- [x] Modelo Config
- [x] ConfigRepository
- [x] Use Cases (Get, Update, GetAll)
- [x] ConfigController
- [x] Rotas admin/config
- [x] Valor padrão (questions.visible = true)

### Frontend
- [x] API config.ts
- [x] QuestionsVisibilityControl component
- [x] QuestionCard com prop showQRCode
- [x] AdminQuestionsPage mostra QR Codes
- [x] AdminDashboardPage com controle
- [x] Questions page com lógica condicional
- [x] Scoreboard quando perguntas ocultas

### Testes
- [x] Teste manual backend (curl)
- [x] Teste manual frontend (admin)
- [x] Teste manual frontend (participante)
- [x] Validação de QR Code
- [x] Validação de permissões

---

## 🎉 Resultado Final

### ✅ Funcionalidades Implementadas

1. **Controle Admin**
   - Toggle simples no dashboard
   - Feedback visual claro
   - Atualização em tempo real

2. **QR Codes**
   - Gerados automaticamente (UUID)
   - Exibidos em cada pergunta (admin)
   - Tamanho adequado (150x150px)
   - Podem ser impressos/compartilhados

3. **Experiência Participante**
   - **Perguntas visíveis:** Lista completa
   - **Perguntas ocultas:** Ranking + QR Code
   - Acesso direto via `/questions/:uuid`
   - Sem quebra de funcionalidade

4. **Segurança**
   - Apenas admins podem alterar configuração
   - Participantes respeitam a configuração
   - Admins sempre veem perguntas

---

## 🚀 Como Usar

### 1. Iniciar Backend
```bash
cd back
npm run dev
```

### 2. Iniciar Frontend
```bash
cd front
npm run dev
```

### 3. Testar Feature
1. Login como admin: `admin` / `admin123`
2. Acessar: http://localhost:5173/admin
3. Desabilitar "Visualização de Perguntas"
4. Acessar: http://localhost:5173/admin/questions
5. Ver QR Codes
6. Fazer logout e login como participante
7. Acessar: http://localhost:5173/questions
8. Ver ranking e mensagem de QR Code

---

**Status:** ✅ **FEATURE COMPLETA E FUNCIONAL**  
**Pronto para:** Produção  
**Próximo passo:** Testar com usuários reais

