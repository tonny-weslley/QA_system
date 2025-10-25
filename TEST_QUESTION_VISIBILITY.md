# 🧪 Teste de Diagnóstico: Erro "Admin access required"

## 🔍 Problema Relatado

Ao acessar a tela de perguntas como usuário participante (não admin), recebe erro "Admin access required".

## ✅ Verificações Realizadas

1. **Rota GET /api/questions** - ✅ Configurada corretamente
   - Usa apenas `authMiddleware` (sem `adminMiddleware`)
   - Localização: `/back/src/interfaces/routes/questionRoutes.ts:80`

2. **Use Case ListQuestions** - ✅ Atualizado
   - Filtra perguntas invisíveis para não-admins via `findVisible()`
   - Admins veem todas via `findAll()`

3. **Use Case GetQuestionById** - ✅ Corrigido
   - Adicionada validação de visibilidade para não-admins
   - Retorna campo `visible` no response

## 🔧 Possíveis Causas

### 1. Token JWT com role incorreta

**Verificar:**
```bash
# Decodificar o token JWT no navegador
# Abra o DevTools > Application > Local Storage
# Procure por 'token' ou similar
# Cole o token em https://jwt.io e verifique o campo "role"
```

**Esperado:**
```json
{
  "userId": "...",
  "username": "...",
  "role": "participant"  // ← Deve ser "participant", não "admin"
}
```

### 2. Frontend fazendo requisição para rota errada

**Verificar no DevTools > Network:**
- URL da requisição deve ser: `GET http://localhost:3000/api/questions`
- **NÃO** deve ser: `GET http://localhost:3000/api/admin/...`

### 3. Cache do navegador

**Solução:**
```bash
# Limpar cache e fazer hard reload
# Chrome/Edge: Ctrl + Shift + R
# Firefox: Ctrl + F5
```

### 4. Backend não reiniciado após mudanças

**Solução:**
```bash
cd /home/tonny/Documents/personal/halloween/back
npm run dev  # ou yarn dev
```

## 🧪 Testes Manuais

### Teste 1: Verificar endpoint diretamente

```bash
# 1. Fazer login como participante
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "participant_username", "password": "participant_password"}'

# Copiar o token retornado

# 2. Listar perguntas
curl http://localhost:3000/api/questions \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# ✅ Deve retornar 200 OK com lista de perguntas visíveis
# ❌ Se retornar 403 "Admin access required", há um problema
```

### Teste 2: Verificar no navegador

1. Abrir DevTools (F12)
2. Ir para aba **Network**
3. Fazer login como participante
4. Acessar `/questions`
5. Verificar a requisição `GET /api/questions`
6. Ver o **Status Code** e **Response**

**Esperado:**
- Status: `200 OK`
- Response: Array de perguntas

**Se der erro:**
- Status: `403 Forbidden`
- Response: `{"error": "Admin access required"}`

## 🔍 Debugging Adicional

### Verificar logs do backend

```bash
# No terminal onde o backend está rodando, procure por:
# - Qual rota está sendo acessada
# - Qual middleware está bloqueando
# - Qual é o role do usuário no token
```

### Adicionar logs temporários

Se necessário, adicione logs no `authMiddleware`:

```typescript
// /back/src/interfaces/middlewares/authMiddleware.ts

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔍 Auth Header:', authHeader);

    // ... resto do código ...

    const decoded = JWTService.verifyToken(token);
    console.log('✅ Token decoded:', decoded);  // ← Adicionar este log
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Auth error:', error);  // ← Adicionar este log
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
};
```

## 📋 Checklist de Resolução

- [ ] Verificar se o backend está rodando
- [ ] Verificar se o token JWT tem `role: "participant"`
- [ ] Verificar se a URL da requisição é `/api/questions` (não `/api/admin/...`)
- [ ] Limpar cache do navegador
- [ ] Fazer logout e login novamente
- [ ] Verificar logs do backend
- [ ] Testar com curl/Postman

## 🆘 Se o problema persistir

**Informações necessárias para debug:**

1. **Request URL** (do DevTools Network)
2. **Request Headers** (especialmente Authorization)
3. **Response Status** e **Response Body**
4. **Logs do backend** (se houver)
5. **Token JWT decodificado** (sem dados sensíveis)

---

**Atualizado:** 2025-10-25
