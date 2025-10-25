# 🚀 Deploy na Vercel - Halloween Quiz Frontend

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Backend já deployado (obter URL da API)
3. Repositório Git (GitHub, GitLab ou Bitbucket)

## 🔧 Configuração

### 1. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no painel da Vercel:

```env
VITE_API_URL=https://seu-backend.vercel.app
VITE_WS_URL=wss://seu-backend.vercel.app
VITE_ENV=production
```

⚠️ **Importante:** As variáveis devem começar com `VITE_` para serem expostas no frontend.

### 2. Deploy via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (primeira vez)
cd /home/tonny/Documents/personal/halloween/front
vercel

# Deploy para produção
vercel --prod
```

### 3. Deploy via Dashboard

1. Acesse https://vercel.com/new
2. Conecte seu repositório Git
3. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Adicione variáveis de ambiente
5. Clique em "Deploy"

## 📁 Estrutura de Arquivos

```
front/
├── dist/                 # Build output (gerado)
├── public/              # Assets estáticos
├── src/                 # Código fonte
├── vercel.json          # Configuração Vercel
├── .vercelignore        # Arquivos ignorados
├── .env.example         # Exemplo de variáveis
└── package.json
```

## ⚙️ Configurações

### vercel.json

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

**Explicação:**
- `rewrites`: Redireciona todas as rotas para index.html (SPA)
- `headers`: Headers de segurança

## 🔍 Verificação

Após deploy, verifique:

- ✅ `https://seu-frontend.vercel.app/` - Página inicial
- ✅ `https://seu-frontend.vercel.app/login` - Login
- ✅ `https://seu-frontend.vercel.app/register` - Registro
- ✅ `https://seu-frontend.vercel.app/questions` - Perguntas
- ✅ Console do navegador sem erros de CORS

## 🐛 Troubleshooting

### Erro: "Failed to fetch"

**Causa:** URL da API incorreta ou CORS não configurado

**Solução:**
1. Verificar `VITE_API_URL` na Vercel
2. Verificar CORS no backend (`CORS_ORIGIN`)
3. Certificar que backend está rodando

### Erro: "Module not found"

**Causa:** Dependência faltando

**Solução:**
```bash
npm install
npm run build
```

### Erro: "404 on refresh"

**Causa:** Rewrites não configurados

**Solução:**
- Verificar se `vercel.json` existe
- Verificar configuração de rewrites

### Erro: "Environment variable not defined"

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
1. Ir para Vercel Dashboard > Project > Settings > Environment Variables
2. Adicionar todas as variáveis necessárias
3. Redeploy

## 🔐 Segurança

- ✅ Usar HTTPS (automático na Vercel)
- ✅ Configurar CORS no backend
- ✅ Não expor secrets no código
- ✅ Usar variáveis de ambiente
- ✅ Headers de segurança configurados

## 📊 Monitoramento

- **Analytics:** Vercel Dashboard > Analytics
- **Logs:** Vercel Dashboard > Deployments > Logs
- **Performance:** Vercel Dashboard > Speed Insights

## 🎯 Checklist de Deploy

- [ ] Backend deployado e funcionando
- [ ] URL do backend obtida
- [ ] Variáveis de ambiente configuradas
- [ ] `vercel.json` criado
- [ ] `.vercelignore` criado
- [ ] `.env.example` criado
- [ ] Build local funcionando (`npm run build`)
- [ ] Deploy realizado
- [ ] Rotas testadas
- [ ] CORS funcionando
- [ ] WebSocket conectando (se aplicável)
- [ ] Testes end-to-end

## 📝 Comandos Úteis

```bash
# Build local
npm run build

# Preview local do build
npm run preview

# Ver logs em tempo real
vercel logs

# Listar deployments
vercel ls

# Remover deployment
vercel rm [deployment-url]

# Adicionar variável de ambiente
vercel env add VITE_API_URL

# Listar variáveis
vercel env ls

# Promover deployment para produção
vercel promote [deployment-url]
```

## 🔄 CI/CD Automático

A Vercel automaticamente:
- ✅ Detecta pushes no Git
- ✅ Roda build
- ✅ Faz deploy
- ✅ Gera preview para PRs
- ✅ Deploy para produção no merge

## 🌐 Domínio Customizado

1. Ir para Vercel Dashboard > Project > Settings > Domains
2. Adicionar domínio customizado
3. Configurar DNS conforme instruções
4. Aguardar propagação (pode levar até 48h)

## 📱 Preview Deployments

Cada PR gera um preview deployment:
- URL única para testar
- Não afeta produção
- Feedback visual no PR

## ⚡ Performance

### Otimizações Automáticas

- ✅ Compressão Gzip/Brotli
- ✅ CDN global
- ✅ Cache inteligente
- ✅ Image optimization
- ✅ Code splitting

### Métricas

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Largest Contentful Paint:** < 2.5s

## 🎨 Customizações

### Build Command Customizado

```json
{
  "buildCommand": "npm run build && npm run post-build"
}
```

### Output Directory Customizado

```json
{
  "outputDirectory": "build"
}
```

## 📚 Recursos

- **Dashboard:** https://vercel.com/dashboard
- **Docs:** https://vercel.com/docs
- **CLI Docs:** https://vercel.com/docs/cli
- **Support:** https://vercel.com/support

## 🎉 Próximos Passos

1. Configure variáveis de ambiente
2. Execute `vercel` no diretório `/front`
3. Teste os endpoints
4. Deploy para produção com `vercel --prod`
5. Configure domínio customizado (opcional)
6. Monitore analytics e performance

---

**Desenvolvido por:** Arctic Labz  
**Framework:** React + Vite + TypeScript  
**Hosting:** Vercel  
**Arquitetura:** Atomic Design + Clean Architecture
