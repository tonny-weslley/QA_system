# 🎃 Halloween Quiz - Frontend

Aplicação web temática de Halloween para quiz interativo com perguntas e respostas em tempo real.

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **React Router** - Navegação
- **Axios** - HTTP client
- **Socket.io Client** - WebSocket
- **Framer Motion** - Animações
- **Atomic Design** - Arquitetura de componentes

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com as URLs do backend

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🎨 Estrutura do Projeto (Atomic Design)

```
src/
├── components/
│   ├── atoms/          # Componentes básicos (Button, Input, Badge, etc.)
│   ├── molecules/      # Combinações de atoms (Card, FormField, etc.)
│   ├── organisms/      # Seções complexas
│   ├── templates/      # Layouts de página
│   └── pages/          # Páginas completas
├── lib/
│   ├── api/            # Clients da API
│   ├── context/        # React Context
│   ├── hooks/          # Custom hooks
│   └── utils/          # Utilitários
└── styles/             # Estilos globais
```

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação
- Login e cadastro
- JWT token management
- Rotas protegidas
- Logout

### ✅ Perguntas
- Listar perguntas disponíveis
- Visualizar detalhes
- Responder perguntas
- Feedback imediato

### ✅ Scoreboard
- Ranking em tempo real
- Destaque do usuário
- Medalhas top 3

## 🎨 Design System

### Cores Halloween
- **Purple:** `#6B21A8`
- **Orange:** `#F97316`
- **Black:** `#0F0F0F`
- **Success:** `#10B981`
- **Error:** `#EF4444`

### Fontes
- **Creepster** - Títulos temáticos
- **Inter** - Texto geral

## 📱 Responsividade

- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor em http://localhost:5173

# Build
npm run build        # Cria build de produção

# Preview
npm run preview      # Preview do build de produção

# Lint
npm run lint         # Executa ESLint
```

## 🌐 Integração com Backend

O frontend se conecta ao backend através das seguintes variáveis de ambiente:

```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

### Endpoints Integrados
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/questions` - Listar perguntas
- `GET /api/questions/:id` - Obter pergunta
- `POST /api/answers` - Responder pergunta
- `GET /api/scores` - Scoreboard

## 📚 Componentes Disponíveis

### Atoms
- **Button** - Botão com variantes (primary, secondary, danger, ghost)
- **Input** - Campo de entrada com validação
- **Badge** - Badge com variantes de dificuldade
- **Typography** - Tipografia com variantes (h1-h4, p, small)
- **Spinner** - Loading indicator
- **Icon** - Ícones temáticos

### Molecules
- **Card** - Container estilizado
- **FormField** - Label + Input + Error

### Pages
- **Login** - Página de autenticação
- **Register** - Página de cadastro
- **Questions** - Lista de perguntas
- **QuestionDetail** - Responder pergunta
- **Scoreboard** - Ranking

## ✅ Funcionalidades Completas

### Para Participantes
- ✅ Login e cadastro
- ✅ Listar perguntas disponíveis
- ✅ Responder perguntas
- ✅ Feedback imediato (acertou/errou)
- ✅ Confete ao acertar 🎉
- ✅ Ver ranking em tempo real
- ✅ Ver pódio final animado

### Para Admins
- ✅ Dashboard com estatísticas
- ✅ Desbloquear perguntas
- ✅ Zerar pontuações
- ✅ Finalizar evento
- ✅ Ver top 10 participantes
- ✅ Ver estatísticas por pergunta

### Animações
- ✅ Page transitions suaves
- ✅ Stagger animations em listas
- ✅ Confete ao acertar respostas
- ✅ Pódio animado (crescendo do chão)
- ✅ Modais com spring animation

## 🎯 Melhorias Futuras (Opcional)

- [ ] Storybook para documentação
- [ ] Testes unitários (Jest)
- [ ] Testes E2E (Playwright)
- [ ] PWA (Progressive Web App)
- [ ] SSR (Server-Side Rendering)

## 📝 Documentação

- [FRD Frontend](./docs/frontend-frd.md) - Requisitos funcionais
- [Implementation Guide](./docs/IMPLEMENTATION_GUIDE.md) - Guia de implementação
- [Final Status](./docs/FINAL_STATUS.md) - Status da implementação
- [Backend Schema](./docs/back-schema.md) - Schema da API

## 🤝 Contribuindo

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure o `.env`
4. Inicie o servidor: `npm run dev`
5. Faça suas alterações seguindo Atomic Design
6. Teste suas mudanças
7. Commit e push

## 📄 Licença

Este projeto é parte do Halloween Quiz App.

---

**Desenvolvido com 🎃 usando React + TypeScript + Vite**
