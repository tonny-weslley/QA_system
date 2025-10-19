🎃 PRD — MVP de Aplicação Web de Perguntas e Respostas para Halloween
1. Visão Geral do Projeto

Uma aplicação web temática de Halloween para realização de uma brincadeira interativa de perguntas e respostas. Haverá dois tipos de usuários: administrador e participante. O objetivo é criar uma competição leve e divertida com perguntas de múltipla escolha, pontuação por dificuldade, QR codes interativos e um placar em tempo real. Ao final do evento, um pódio destacará os 3 melhores colocados.

2. Problema & Oportunidade

Problema: Organizar dinâmicas presenciais de perguntas e respostas geralmente exige papel, controle manual e não permite uma experiência interativa em tempo real.

Oportunidade: Criar uma aplicação web que centralize a gestão das perguntas, permita acesso fácil via QR code, controle de respostas e pontuações automáticas, e ofereça uma experiência temática e animada, elevando o engajamento do público em eventos de Halloween.

3. Usuários & Job To Be Done (JTBD)
👤 Participante

Cadastro: Nome de usuário e senha.

Job: Acessar perguntas via QR code, responder uma vez, ganhar pontos e ver sua posição no ranking.

Necessidade: Interface amigável, temática, e divertida.

🛠️ Administrador

Cadastro/Login: Nome de usuário e senha.

Job: Criar perguntas, monitorar ranking, resetar partidas, finalizar evento.

Necessidade: Painel de controle simples e funcional para gerenciar toda a brincadeira.

4. Funcionalidades Principais (MVP)
🔐 Acesso e Usuários

Cadastro/login com nome de usuário e senha.

Dois níveis de acesso: administrador e participante.

🎯 Perguntas

Criadas e gerenciadas pelo administrador.

Tipo: Múltipla escolha.

Cada pergunta deve ter:

Enunciado

2 a 5 opções de resposta

Pelo menos uma correta

Indicador de dificuldade (fácil, médio, difícil)

QR code gerado com URL única

📱 Respostas

Um participante só pode responder uma vez a cada pergunta.

Se acertar, a pergunta é bloqueada para os outros participantes.

Se errar, outros ainda podem responder.

🎲 Pontuação

Dificuldade influencia pontuação:

Fácil: 10 pontos

Médio: 20 pontos

Difícil: 30 pontos

📊 Scoreboard (Tempo Real via WebSocket)

Participantes:

Nome + Pontuação total

Administrador:

Nome + Pontuação por dificuldade (Fácil / Médio / Difícil) + Pontuação total

🧹 Controles do Administrador

Resetar perguntas (liberar todas para resposta)

Zerar pontuação

Finalizar evento e exibir tela de pódio (Top 3)

Exibir ranking completo ao fim do pódio

📱 Experiência

Design com tema Halloween (cores: roxo, laranja, preto)

Animações leves e divertidas durante interações

Responsivo para desktop e mobile

Leve e de fácil navegação

5. Tech Stack Recomendado (Web)
Front-End

React + Vite

Tailwind CSS (tema customizado para Halloween)

Framer Motion (para animações)

QR Code Generator Lib (ex: qrcode.react)

Back-End

Node.js (Express)

MongoDB Atlas (banco de dados em nuvem)

WebSocket (Socket.io) para atualização em tempo real

Autenticação

JWT (para sessões simples e seguras)

Infraestrutura

Hospedagem: Render, Railway, ou Vercel (Frontend) + MongoDB Atlas (Banco)

Deploy automatizado com GitHub

6. Estrutura de Arquivos (Sugerida)
/client
├── public/
├── src/
│   ├── assets/ (ícones, imagens, cores)
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── context/
│   ├── utils/
│   └── main.jsx

/server
├── controllers/
├── routes/
├── models/
├── middleware/
├── websocket/
└── index.js

7. Requisitos Adicionais

Design deve refletir o tema de Halloween com elementos decorativos e funcionais.

QR Codes únicos para cada pergunta, redirecionando diretamente para a interface de resposta.

Segurança básica: Validação simples de login, controle de quem já respondeu.

Dashboard com contagem de perguntas ativas, respondidas, e acertos.

Finalização do evento com pódio animado, destacando top 3.
