# 📋 Relatório de Implementação: Controle de Visibilidade de Perguntas

**Data:** 2025-10-25  
**Status:** ✅ **COMPLETO**  
**Agentes:** backend-node-clean-arch + frontend-next-atomic-shadcn

---

## 🎯 Objetivo

Implementar um sistema de controle de visibilidade das perguntas, permitindo que apenas administradores decidam quais perguntas serão exibidas aos participantes (usuários não administradores).

---

## 📊 Resumo da Implementação

### Backend (Node.js + TypeScript + Clean Architecture)

#### 1. Modelo de Dados Atualizado

**Arquivo:** `/back/src/domain/entities/Question.ts`

- ✅ Adicionado campo `visible: boolean` à interface `Question`
- ✅ Adicionado campo `visible?: boolean` à interface `UpdateQuestionDTO`
- ✅ Adicionado campo `visible: boolean` à interface `QuestionResponse`
- ✅ Valor padrão: `true` (pergunta visível por padrão)

#### 2. Repository Atualizado

**Arquivo:** `/back/src/infra/database/repositories/QuestionRepository.ts`

- ✅ Método `create()`: Define `visible: true` por padrão
- ✅ Método `findById()`: Retorna campo `visible` (default: `true`)
- ✅ Método `findAll()`: Retorna campo `visible` (default: `true`)
- ✅ Método `findAvailable()`: Retorna campo `visible` (default: `true`)
- ✅ **NOVO** Método `findVisible()`: Retorna apenas perguntas com `visible !== false`
- ✅ Método `update()`: Suporta atualização do campo `visible`
- ✅ **NOVO** Método `updateVisibility()`: Atualiza apenas a visibilidade de uma pergunta

#### 3. Interface do Repository

**Arquivo:** `/back/src/domain/interfaces/IQuestionRepository.ts`

- ✅ Adicionado método `findVisible(): Promise<Question[]>`
- ✅ Adicionado método `updateVisibility(id: string, visible: boolean): Promise<boolean>`

#### 4. Use Cases

**Arquivo:** `/back/src/usecases/question/ListQuestions.ts`

- ✅ Modificado para usar `findVisible()` para participantes (não-admins)
- ✅ Admins continuam vendo todas as perguntas via `findAll()`
- ✅ Adicionado campo `visible` ao retorno

**Arquivo:** `/back/src/usecases/question/UpdateQuestionVisibility.ts` (NOVO)

- ✅ Criado use case dedicado para atualizar visibilidade
- ✅ Valida se a pergunta existe antes de atualizar
- ✅ Retorna erro se a pergunta não for encontrada

#### 5. Controller

**Arquivo:** `/back/src/interfaces/controllers/QuestionController.ts`

- ✅ Adicionado método `updateVisibility(req, res)`
- ✅ Valida que `visible` é um boolean
- ✅ Retorna mensagem de sucesso após atualização

#### 6. Rotas

**Arquivo:** `/back/src/interfaces/routes/questionRoutes.ts`

- ✅ Adicionada rota `PATCH /api/questions/:id/visibility`
- ✅ Protegida com `authMiddleware` e `adminMiddleware`
- ✅ Documentação Swagger completa

---

### Frontend (Next.js + TypeScript + Atomic Design)

#### 1. API Client Atualizado

**Arquivo:** `/front/src/lib/api/questions.ts`

- ✅ Adicionado campo `visible: boolean` à interface `Question`
- ✅ Adicionado método `updateVisibility(id: string, visible: boolean): Promise<void>`

#### 2. Componente Badge Atualizado

**Arquivo:** `/front/src/components/atoms/Badge/Badge.tsx`

- ✅ Adicionada variante `'warning'` para indicar perguntas invisíveis
- ✅ Estilo: `bg-yellow-500/20 text-yellow-400 border-yellow-500/30`

#### 3. Componente QuestionCard Atualizado

**Arquivo:** `/front/src/components/organisms/QuestionCard/QuestionCard.tsx`

**Novas Props:**
- ✅ `visible?: boolean` - Estado de visibilidade da pergunta
- ✅ `onToggleVisibility?: (visible: boolean) => void` - Callback para alternar visibilidade
- ✅ `showVisibilityToggle?: boolean` - Exibir controle de visibilidade

**Novas Funcionalidades:**
- ✅ Badge "👁️ Invisível" quando `visible = false`
- ✅ Toggle switch estilizado para alternar visibilidade
- ✅ Indicação visual do estado (verde = visível, cinza = invisível)
- ✅ Texto explicativo: "Participantes podem ver" / "Apenas admins"

#### 4. Página Admin de Perguntas Atualizada

**Arquivo:** `/front/src/components/pages/AdminQuestionsPage/AdminQuestionsPage.tsx`

- ✅ Adicionado handler `handleToggleVisibility(id, visible)`
- ✅ Passa props `visible`, `onToggleVisibility` e `showVisibilityToggle` para `QuestionCard`
- ✅ Recarrega lista de perguntas após atualização de visibilidade
- ✅ Exibe feedback de erro em caso de falha

#### 5. Página de Perguntas (Participantes)

**Arquivo:** `/front/src/components/pages/Questions/Questions.tsx`

- ✅ **Já implementado** - Usa configuração `questions.visible` para controlar exibição
- ✅ Backend filtra automaticamente perguntas invisíveis para não-admins
- ✅ Admins sempre veem todas as perguntas

---

## 🔄 Fluxo de Funcionamento

### Para Administradores:

1. **Acessar painel de gerenciamento de perguntas** (`/admin/questions`)
2. **Visualizar todas as perguntas** com toggle de visibilidade em cada card
3. **Alternar visibilidade** clicando no switch
4. **Feedback imediato** - lista atualizada automaticamente
5. **Perguntas invisíveis** exibem badge "👁️ Invisível"

### Para Participantes (Não-Admins):

1. **Acessar página de perguntas** (`/questions`)
2. **Ver apenas perguntas visíveis** (`visible = true`)
3. **Perguntas invisíveis** não aparecem na listagem
4. **Acesso direto via ID** ainda funciona (se souberem o ID)

---

## 🧪 Testes Recomendados

### Backend

```bash
# 1. Atualizar visibilidade de uma pergunta
curl -X PATCH http://localhost:3000/api/questions/{id}/visibility \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"visible": false}'

# 2. Listar perguntas como admin (deve ver todas)
curl http://localhost:3000/api/questions \
  -H "Authorization: Bearer <admin-token>"

# 3. Listar perguntas como participante (deve ver apenas visíveis)
curl http://localhost:3000/api/questions \
  -H "Authorization: Bearer <participant-token>"
```

### Frontend

**Como Admin:**
1. ✅ Login como admin
2. ✅ Acessar `/admin/questions`
3. ✅ Ver toggle de visibilidade em cada pergunta
4. ✅ Desabilitar visibilidade de uma pergunta
5. ✅ Verificar badge "👁️ Invisível" aparece
6. ✅ Habilitar visibilidade novamente
7. ✅ Verificar badge desaparece

**Como Participante:**
1. ✅ Login como participante
2. ✅ Admin desabilita visibilidade de uma pergunta
3. ✅ Acessar `/questions`
4. ✅ Verificar que pergunta invisível não aparece
5. ✅ Admin habilita visibilidade novamente
6. ✅ Atualizar página
7. ✅ Verificar que pergunta aparece novamente

---

## 📝 Arquivos Modificados/Criados

### Backend (9 arquivos)

**Modificados:**
- `/back/src/domain/entities/Question.ts`
- `/back/src/domain/interfaces/IQuestionRepository.ts`
- `/back/src/infra/database/repositories/QuestionRepository.ts`
- `/back/src/usecases/question/ListQuestions.ts`
- `/back/src/interfaces/controllers/QuestionController.ts`
- `/back/src/interfaces/routes/questionRoutes.ts`

**Criados:**
- `/back/src/usecases/question/UpdateQuestionVisibility.ts`

### Frontend (4 arquivos)

**Modificados:**
- `/front/src/lib/api/questions.ts`
- `/front/src/components/atoms/Badge/Badge.tsx`
- `/front/src/components/organisms/QuestionCard/QuestionCard.tsx`
- `/front/src/components/pages/AdminQuestionsPage/AdminQuestionsPage.tsx`

---

## ✅ Critérios de Aceitação

### Funcionais

- ✅ Admin consegue alterar a visibilidade de qualquer pergunta
- ✅ Usuários comuns não veem perguntas com `visible = false`
- ✅ Alterações de visibilidade são refletidas imediatamente no sistema
- ✅ O campo `visible` é protegido — apenas admins podem modificá-lo
- ✅ Perguntas criadas são visíveis por padrão (`visible = true`)

### Técnicos

- ✅ Modelo `Question` inclui campo `visible: boolean`
- ✅ Repository filtra perguntas invisíveis para não-admins
- ✅ Endpoint `PATCH /api/questions/:id/visibility` protegido (admin-only)
- ✅ Frontend exibe toggle de visibilidade no painel admin
- ✅ Frontend filtra perguntas automaticamente (via backend)

### UX/UI

- ✅ Toggle visual intuitivo (verde = visível, cinza = invisível)
- ✅ Badge "👁️ Invisível" para perguntas ocultas
- ✅ Texto explicativo do estado de visibilidade
- ✅ Feedback imediato após alteração
- ✅ Interface consistente com design system existente

---

## 🚀 Próximos Passos Sugeridos

1. **Testes Automatizados**
   - Criar testes unitários para `UpdateQuestionVisibility` use case
   - Criar testes de integração para endpoint de visibilidade
   - Criar testes E2E para fluxo completo

2. **Melhorias Futuras**
   - Adicionar log de auditoria para mudanças de visibilidade
   - Implementar visibilidade em lote (múltiplas perguntas)
   - Adicionar filtro na lista de perguntas (mostrar/ocultar invisíveis)

3. **Documentação**
   - Atualizar Swagger com exemplos de uso
   - Adicionar seção no README sobre controle de visibilidade
   - Criar guia de uso para administradores

---

## 🎉 Conclusão

A implementação do controle de visibilidade de perguntas foi concluída com sucesso, seguindo os princípios de **Clean Architecture** no backend e **Atomic Design** no frontend.

**Principais Conquistas:**
- ✅ Separação clara de responsabilidades
- ✅ Código modular e testável
- ✅ Interface intuitiva e responsiva
- ✅ Segurança: apenas admins podem alterar visibilidade
- ✅ Performance: filtro no banco de dados (não no frontend)
- ✅ Compatibilidade: perguntas antigas recebem `visible = true` automaticamente

**Status:** Pronto para produção após testes manuais.

---

**Desenvolvido por:** Orchestrator + backend-node-clean-arch + frontend-next-atomic-shadcn  
**Arquitetura:** Clean Architecture + Atomic Design  
**Stack:** Node.js, TypeScript, MongoDB, Next.js, TailwindCSS
