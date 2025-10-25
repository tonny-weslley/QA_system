# Configuração de CORS - Correção de Erros de Preflight

## Problema Resolvido
Erro de CORS (preflight) ao tentar acessar o backend a partir do frontend em produção.

## Mudanças Realizadas

### Backend (`/back/src/main.ts`)

A configuração de CORS foi atualizada para:

1. **Permitir múltiplas origens**:
   - `http://localhost:5173` (desenvolvimento Vite)
   - `http://localhost:3000` (desenvolvimento alternativo)
   - Qualquer URL da Vercel (`.vercel.app`)
   - URLs customizadas via variáveis de ambiente

2. **Configuração completa de preflight**:
   - Métodos: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`
   - Headers permitidos: `Content-Type`, `Authorization`
   - Credentials: `true`
   - MaxAge: 24 horas (cache de preflight)

### Variáveis de Ambiente

#### Backend (`.env`)
```bash
# CORS - Multiple origins supported
CORS_ORIGIN=https://seu-frontend.vercel.app
FRONTEND_URL=https://seu-frontend.vercel.app
```

#### Frontend (`.env`)
```bash
# API Configuration
VITE_API_URL=https://seu-backend.vercel.app
```

## Configuração no Vercel

### Backend
1. Acesse o projeto no Vercel Dashboard
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - `CORS_ORIGIN`: URL do seu frontend (ex: `https://halloween-quiz.vercel.app`)
   - `FRONTEND_URL`: mesma URL do frontend
   - `MONGODB_URI`: sua connection string do MongoDB
   - `JWT_SECRET`: seu secret JWT

### Frontend
1. Acesse o projeto no Vercel Dashboard
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - `VITE_API_URL`: URL do seu backend (ex: `https://halloween-api.vercel.app`)

## Testando Localmente

1. **Backend**:
```bash
cd back
# Atualize o arquivo .env com as URLs corretas
npm run dev
```

2. **Frontend**:
```bash
cd front
# Atualize o arquivo .env com a URL do backend
npm run dev
```

## Verificando CORS

Para testar se o CORS está funcionando:

```bash
# Teste de preflight
curl -X OPTIONS https://seu-backend.vercel.app/api/questions \
  -H "Origin: https://seu-frontend.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v
```

Você deve ver nos headers de resposta:
- `Access-Control-Allow-Origin: https://seu-frontend.vercel.app`
- `Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type,Authorization`
- `Access-Control-Allow-Credentials: true`

## Troubleshooting

### Erro: "No 'Access-Control-Allow-Origin' header"
- Verifique se a URL do frontend está corretamente configurada no backend
- Certifique-se de que a variável `CORS_ORIGIN` ou `FRONTEND_URL` está definida

### Erro: "CORS policy: Response to preflight request doesn't pass"
- Verifique se o método HTTP está na lista de métodos permitidos
- Confirme que os headers estão corretos
- Verifique se `credentials: true` está configurado em ambos os lados

### Erro: "The value of the 'Access-Control-Allow-Credentials' header"
- Certifique-se de que `credentials: true` está configurado no CORS do backend
- Verifique se o axios no frontend está enviando `withCredentials: true` (se necessário)

## Notas Importantes

1. **Produção**: Sempre use HTTPS em produção
2. **Segurança**: Não use `origin: '*'` com `credentials: true`
3. **Cache**: O preflight é cacheado por 24 horas (maxAge: 86400)
4. **Vercel**: URLs `.vercel.app` são automaticamente permitidas
