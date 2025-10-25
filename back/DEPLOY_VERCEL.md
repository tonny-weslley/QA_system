# 🚀 Deploy na Vercel - Halloween Quiz Backend

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Banco de dados MongoDB (recomendado: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
3. Repositório Git (GitHub, GitLab ou Bitbucket)

## 🔧 Configuração

### 1. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no painel da Vercel:

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/halloween-quiz?retryWrites=true&w=majority
MONGODB_DB_NAME=halloween-quiz

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=https://seu-frontend.vercel.app

# API
API_URL=https://seu-backend.vercel.app

# Node
NODE_ENV=production
```

### 2. MongoDB Atlas Setup

1. Criar cluster no MongoDB Atlas
2. Criar database user
3. Adicionar IP da Vercel à whitelist (ou permitir todos: `0.0.0.0/0`)
4. Copiar connection string

### 3. Deploy via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### 4. Deploy via Git

1. Conectar repositório no painel da Vercel
2. Configurar variáveis de ambiente
3. Deploy automático a cada push

## 📁 Estrutura de Arquivos

```
back/
├── api/
│   └── index.ts          # Entry point para Vercel
├── public/
│   └── index.html        # Página inicial
├── src/
│   └── ...               # Código fonte
├── vercel.json           # Configuração Vercel
├── .vercelignore         # Arquivos ignorados
└── package.json
```

## 🔍 Verificação

Após deploy, verifique:

- ✅ `https://seu-backend.vercel.app/` - Página inicial
- ✅ `https://seu-backend.vercel.app/healthz` - Health check
- ✅ `https://seu-backend.vercel.app/api-docs` - Swagger docs
- ✅ `https://seu-backend.vercel.app/api/auth/login` - API funcionando

## ⚙️ Configurações Importantes

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

### Diferenças do Ambiente Local

- **WebSocket:** Não suportado nativamente na Vercel (usar alternativas como Pusher, Ably)
- **Serverless:** Cada requisição é uma função serverless
- **Timeout:** Máximo de 10s por requisição (hobby plan)
- **Cold Start:** Primeira requisição pode ser mais lenta

## 🐛 Troubleshooting

### Erro: "No Output Directory"
- ✅ Verificar se pasta `public/` existe
- ✅ Verificar `vercel.json` configurado corretamente

### Erro: "Module not found"
- ✅ Verificar se todas as dependências estão em `dependencies` (não `devDependencies`)
- ✅ Rodar `npm install` localmente

### Erro: "Database connection failed"
- ✅ Verificar variável `MONGODB_URI`
- ✅ Verificar whitelist de IPs no MongoDB Atlas
- ✅ Verificar credenciais do database user

### Erro: "Function timeout"
- ✅ Otimizar queries do banco
- ✅ Adicionar índices no MongoDB
- ✅ Considerar upgrade do plano Vercel

## 📊 Monitoramento

- **Logs:** Painel Vercel > Deployments > Logs
- **Analytics:** Painel Vercel > Analytics
- **Errors:** Integrar com Sentry ou similar

## 🔐 Segurança

- ✅ Usar variáveis de ambiente para secrets
- ✅ Habilitar CORS apenas para domínios específicos
- ✅ Usar HTTPS (automático na Vercel)
- ✅ Implementar rate limiting (já configurado)
- ✅ Validar JWT em todas as rotas protegidas

## 📝 Comandos Úteis

```bash
# Ver logs em tempo real
vercel logs

# Listar deployments
vercel ls

# Remover deployment
vercel rm [deployment-url]

# Adicionar variável de ambiente
vercel env add MONGODB_URI

# Listar variáveis
vercel env ls
```

## 🎯 Checklist de Deploy

- [ ] MongoDB Atlas configurado
- [ ] Variáveis de ambiente configuradas
- [ ] `vercel.json` criado
- [ ] Pasta `public/` criada
- [ ] `api/index.ts` criado
- [ ] `.vercelignore` criado
- [ ] Build local funcionando (`npm run build`)
- [ ] Deploy realizado
- [ ] Health check funcionando
- [ ] API endpoints testados
- [ ] CORS configurado corretamente
- [ ] Frontend conectado ao backend

## 🌐 URLs Importantes

- **Dashboard:** https://vercel.com/dashboard
- **Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://cloud.mongodb.com

---

**Desenvolvido por:** Arctic Labz  
**Arquitetura:** Clean Architecture + Serverless  
**Stack:** Node.js, TypeScript, MongoDB, Vercel
