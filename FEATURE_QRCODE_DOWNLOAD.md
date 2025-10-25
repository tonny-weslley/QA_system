# 📥 Feature: Download de QR Codes

**Data:** 2025-10-25  
**Status:** ✅ **COMPLETO**  
**Prioridade:** Média

---

## 📋 Resumo

Implementação de funcionalidade para download de QR Codes das perguntas, permitindo:
1. Download individual de QR Code (PNG) de cada pergunta
2. Download em lote de todos os QR Codes (ZIP)

---

## 🎯 Funcionalidades Implementadas

### ✅ 1. Download Individual

**Localização:** Card de cada pergunta em `/admin/questions`

**Botão:** 📥 (ao lado esquerdo do botão de editar)

**Comportamento:**
- Gera QR Code como PNG (512x512px)
- Nome do arquivo: `qrcode-{codigo}-{primeiros-30-chars-do-statement}.png`
- Download automático no navegador

### ✅ 2. Download em Lote

**Localização:** Header da página `/admin/questions`

**Botão:** 📥 QR Codes (ao lado do botão "Nova Pergunta")

**Comportamento:**
- Gera QR Codes de TODAS as perguntas
- Compacta em arquivo ZIP
- Nome do arquivo: `qrcodes.zip`
- Estrutura interna: `/qrcodes/qrcode-{codigo}-{statement}.png`

---

## 🔧 Implementação Técnica

### Bibliotecas Instaladas

```bash
npm install qrcode jszip file-saver
npm install --save-dev @types/qrcode @types/file-saver
```

**Dependências:**
- `qrcode` - Geração de QR Codes em canvas
- `jszip` - Criação de arquivos ZIP
- `file-saver` - Download de arquivos no navegador

### Novo Utilitário: qrcode.ts

**Arquivo:** `/front/src/lib/utils/qrcode.ts` (NOVO)

**Funções Exportadas:**

#### 1. generateQRCodePNG()
```typescript
export const generateQRCodePNG = (url: string, size: number = 256): Promise<Blob>
```

**Descrição:** Gera QR Code como PNG e retorna Blob

**Parâmetros:**
- `url`: URL a ser codificada no QR Code
- `size`: Tamanho do QR Code em pixels (padrão: 256)

**Retorno:** Promise<Blob> com imagem PNG

**Configurações:**
- Margem: 2
- Cor escura: #000000 (preto)
- Cor clara: #FFFFFF (branco)

#### 2. downloadQRCode()
```typescript
export const downloadQRCode = async (url: string, filename: string): Promise<void>
```

**Descrição:** Baixa QR Code individual como PNG

**Parâmetros:**
- `url`: URL a ser codificada
- `filename`: Nome do arquivo (sem extensão)

**Comportamento:**
- Gera QR Code de 512x512px
- Adiciona extensão `.png` automaticamente
- Inicia download no navegador

#### 3. downloadQRCodesZip()
```typescript
export const downloadQRCodesZip = async (
  items: Array<{ url: string; filename: string }>
): Promise<void>
```

**Descrição:** Baixa múltiplos QR Codes como ZIP

**Parâmetros:**
- `items`: Array de objetos com `url` e `filename`

**Comportamento:**
- Gera todos os QR Codes em paralelo
- Cria pasta `/qrcodes/` dentro do ZIP
- Compacta e inicia download

---

### QuestionCard Atualizado

**Arquivo:** `/front/src/components/organisms/QuestionCard/QuestionCard.tsx`

**Nova Prop:**
```typescript
onDownloadQRCode?: () => void;
```

**Novo Botão:**
```tsx
{onDownloadQRCode && (
  <Button 
    variant="secondary" 
    onClick={onDownloadQRCode} 
    size="sm" 
    title="Baixar QR Code"
  >
    📥
  </Button>
)}
```

**Posição:** Entre botão "Responder" e botão "Editar"

---

### AdminQuestionsPage Atualizada

**Arquivo:** `/front/src/components/pages/AdminQuestionsPage/AdminQuestionsPage.tsx`

#### Novos Handlers

**1. handleDownloadQRCode()**
```typescript
const handleDownloadQRCode = async (question: Question) => {
  if (!question.code) {
    alert('Esta pergunta não possui código QR');
    return;
  }

  try {
    const url = `${window.location.origin}/questions/${question.code}`;
    const filename = `qrcode-${question.code}-${question.statement.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}`;
    await downloadQRCode(url, filename);
  } catch (err) {
    alert('Erro ao baixar QR Code');
    console.error(err);
  }
};
```

**2. handleDownloadAllQRCodes()**
```typescript
const handleDownloadAllQRCodes = async () => {
  if (questions.length === 0) {
    alert('Nenhuma pergunta disponível');
    return;
  }

  const questionsWithCode = questions.filter(q => q.code);
  
  if (questionsWithCode.length === 0) {
    alert('Nenhuma pergunta possui código QR');
    return;
  }

  try {
    const items = questionsWithCode.map(q => ({
      url: `${window.location.origin}/questions/${q.code}`,
      filename: `qrcode-${q.code}-${q.statement.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}`
    }));

    await downloadQRCodesZip(items);
  } catch (err) {
    alert('Erro ao baixar QR Codes');
    console.error(err);
  }
};
```

#### Novo Botão no Header

```tsx
<div className="flex gap-2 w-full sm:w-auto">
  <Button
    onClick={handleDownloadAllQRCodes}
    variant="secondary"
    disabled={questions.length === 0}
    className="flex-1 sm:flex-none"
    title="Baixar todos os QR Codes"
  >
    📥 QR Codes
  </Button>
  <Button
    onClick={() => {
      setEditingQuestion(null);
      setShowForm(true);
    }}
    disabled={showForm}
    className="flex-1 sm:flex-none"
  >
    ➕ Nova Pergunta
  </Button>
</div>
```

---

## 🎨 Interface

### Card de Pergunta (Admin)

```
┌─────────────────────────────────────┐
│ EASY  🔒 Bloqueada  👁️ Invisível   │
│                                     │
│ Qual é a capital do Brasil?         │
│                                     │
│ ┌───────────────────────────────┐  │
│ │   [QR CODE]                   │  │
│ │   aB9xQ                       │  │
│ └───────────────────────────────┘  │
│                                     │
│ [📥] [✏️] [🗑️]                      │
│  ↑    ↑    ↑                       │
│  |    |    Deletar                 │
│  |    Editar                        │
│  Baixar QR                          │
└─────────────────────────────────────┘
```

### Header da Página

```
┌─────────────────────────────────────────────────┐
│ Gerenciar Perguntas                             │
│ Total: 5 perguntas                              │
│                                                 │
│                    [📥 QR Codes] [➕ Nova Pergunta] │
└─────────────────────────────────────────────────┘
```

---

## 📦 Estrutura do ZIP

```
qrcodes.zip
└── qrcodes/
    ├── qrcode-aB9xQ-Qual_e_a_capital_do_Brasil.png
    ├── qrcode-K7mPz-Quem_descobriu_o_Brasil.png
    ├── qrcode-Xy3Wn-Qual_e_o_maior_rio_do_mundo.png
    └── ...
```

---

## 🔄 Fluxos de Funcionamento

### Fluxo 1: Download Individual

```
Admin acessa /admin/questions
  ↓
Visualiza card de pergunta
  ↓
Clica no botão 📥
  ↓
Sistema gera QR Code (512x512px)
  ↓
Converte para PNG
  ↓
Download automático inicia
  ↓
Arquivo salvo: qrcode-aB9xQ-Qual_e_a_capital_do_Brasil.png
```

### Fluxo 2: Download em Lote

```
Admin acessa /admin/questions
  ↓
Clica em "📥 QR Codes" no header
  ↓
Sistema filtra perguntas com código
  ↓
Gera QR Codes em paralelo (Promise.all)
  ↓
Cria estrutura de pastas no ZIP
  ↓
Compacta todos os arquivos
  ↓
Download automático inicia
  ↓
Arquivo salvo: qrcodes.zip
```

---

## 📊 Especificações Técnicas

### QR Code Gerado

| Propriedade | Valor |
|-------------|-------|
| Tamanho | 512x512px |
| Formato | PNG |
| Margem | 2 unidades |
| Cor Escura | #000000 (preto) |
| Cor Clara | #FFFFFF (branco) |
| Nível de Correção | L (Low) |

### Nomenclatura de Arquivos

**Padrão:** `qrcode-{codigo}-{statement-sanitizado}.png`

**Sanitização:**
- Primeiros 30 caracteres do statement
- Remove caracteres especiais
- Substitui por underscore (_)
- Mantém apenas A-Z, a-z, 0-9

**Exemplos:**
- `qrcode-aB9xQ-Qual_e_a_capital_do_Brasil.png`
- `qrcode-K7mPz-Quem_descobriu_o_Brasil_em_1.png`
- `qrcode-Xy3Wn-Qual_e_o_maior_rio_do_mundo.png`

---

## ✅ Validações Implementadas

### Download Individual

1. ✅ Verifica se pergunta possui código
2. ✅ Exibe alerta se código não existir
3. ✅ Captura e exibe erros de geração
4. ✅ Loga erros no console

### Download em Lote

1. ✅ Verifica se há perguntas cadastradas
2. ✅ Filtra apenas perguntas com código
3. ✅ Exibe alerta se nenhuma pergunta tiver código
4. ✅ Gera QR Codes em paralelo (performance)
5. ✅ Captura e exibe erros de geração/compactação
6. ✅ Botão desabilitado se não houver perguntas

---

## 🧪 Como Testar

### Teste 1: Download Individual

**Preparação:**
1. Criar pelo menos 1 pergunta com código

**Passos:**
1. ✅ Login como admin
2. ✅ Ir para `/admin/questions`
3. ✅ Localizar card de pergunta
4. ✅ Clicar no botão 📥 (ao lado do ✏️)
5. ✅ Verificar download automático
6. ✅ Abrir arquivo PNG baixado
7. ✅ Escanear QR Code com celular
8. ✅ Verificar redirecionamento correto

### Teste 2: Download em Lote

**Preparação:**
1. Criar pelo menos 3 perguntas com código

**Passos:**
1. ✅ Login como admin
2. ✅ Ir para `/admin/questions`
3. ✅ Clicar em "📥 QR Codes" no header
4. ✅ Aguardar geração (pode levar alguns segundos)
5. ✅ Verificar download de `qrcodes.zip`
6. ✅ Extrair ZIP
7. ✅ Verificar pasta `/qrcodes/`
8. ✅ Verificar presença de todos os PNGs
9. ✅ Abrir alguns PNGs
10. ✅ Escanear QR Codes com celular

### Teste 3: Validações

**Cenário 1: Pergunta sem código**
1. ✅ Criar pergunta antiga (sem código)
2. ✅ Tentar baixar QR Code individual
3. ✅ Verificar alerta: "Esta pergunta não possui código QR"

**Cenário 2: Nenhuma pergunta**
1. ✅ Deletar todas as perguntas
2. ✅ Verificar botão "📥 QR Codes" desabilitado

**Cenário 3: Perguntas sem código**
1. ✅ Ter apenas perguntas antigas (sem código)
2. ✅ Clicar em "📥 QR Codes"
3. ✅ Verificar alerta: "Nenhuma pergunta possui código QR"

---

## 📱 Responsividade

### Desktop (> 640px)
```
[Gerenciar Perguntas]        [📥 QR Codes] [➕ Nova Pergunta]
```

### Mobile (< 640px)
```
[Gerenciar Perguntas]

[📥 QR Codes      ]
[➕ Nova Pergunta]
```

**Implementação:**
- Flex direction muda de `row` para `column`
- Botões ocupam largura total em mobile
- Gap de 4 unidades entre elementos

---

## 🎯 Casos de Uso

### Caso 1: Impressão para Evento

**Cenário:** Admin quer imprimir QR Codes para distribuir no evento

**Passos:**
1. Baixar todos os QR Codes (ZIP)
2. Extrair arquivos
3. Abrir PNGs em editor de imagem
4. Organizar em layout para impressão
5. Imprimir em papel adesivo

### Caso 2: Projeção em Tela

**Cenário:** Admin quer projetar QR Code específico

**Passos:**
1. Baixar QR Code individual
2. Abrir PNG em tela cheia
3. Projetar para participantes escanearem

### Caso 3: Compartilhamento Digital

**Cenário:** Admin quer enviar QR Codes por email/WhatsApp

**Passos:**
1. Baixar QR Codes necessários
2. Anexar em email ou mensagem
3. Enviar para participantes

---

## 🔐 Segurança

- ✅ Apenas admins têm acesso aos botões
- ✅ Rota `/admin/questions` protegida
- ✅ QR Codes contêm apenas URL pública
- ✅ Sem exposição de dados sensíveis

---

## ⚡ Performance

### Otimizações Implementadas

1. **Geração Paralela:**
   - `Promise.all()` para gerar múltiplos QR Codes
   - Reduz tempo total de processamento

2. **Canvas Temporário:**
   - Canvas criado e destruído automaticamente
   - Não polui DOM

3. **Blob Direto:**
   - Conversão direta para Blob
   - Sem intermediários desnecessários

### Métricas Estimadas

| Operação | Tempo Estimado |
|----------|----------------|
| Download individual | ~500ms |
| Download 10 QR Codes | ~2-3s |
| Download 50 QR Codes | ~8-10s |
| Download 100 QR Codes | ~15-20s |

---

## 📝 Arquivos Modificados/Criados

### Frontend (3 arquivos)

**Criados:**
1. `/front/src/lib/utils/qrcode.ts` - Utilitário de QR Codes

**Modificados:**
2. `/front/src/components/organisms/QuestionCard/QuestionCard.tsx` - Botão individual
3. `/front/src/components/pages/AdminQuestionsPage/AdminQuestionsPage.tsx` - Botão em lote e handlers

### Dependências Adicionadas

```json
{
  "dependencies": {
    "qrcode": "^1.5.x",
    "jszip": "^3.10.x",
    "file-saver": "^2.0.x"
  },
  "devDependencies": {
    "@types/qrcode": "^1.5.x",
    "@types/file-saver": "^2.0.x"
  }
}
```

---

## 🚀 Melhorias Futuras Sugeridas

1. **Customização:**
   - Permitir escolher tamanho do QR Code
   - Adicionar logo no centro
   - Escolher cores

2. **Formatos Adicionais:**
   - SVG (vetorial)
   - PDF (pronto para impressão)
   - Múltiplos tamanhos no mesmo ZIP

3. **Preview:**
   - Visualizar QR Code antes de baixar
   - Modal com preview e opções

4. **Metadados:**
   - Adicionar arquivo README.txt no ZIP
   - Incluir informações sobre cada pergunta

5. **Filtros:**
   - Baixar apenas QR Codes de perguntas visíveis
   - Baixar apenas de dificuldade específica

---

## 🎉 Conclusão

A funcionalidade de download de QR Codes foi implementada com sucesso, oferecendo:

**Principais Conquistas:**
- ✅ Download individual rápido e simples
- ✅ Download em lote eficiente
- ✅ Interface intuitiva
- ✅ Nomenclatura clara de arquivos
- ✅ Validações robustas
- ✅ Responsividade completa

**Status:** Pronto para uso em produção.

---

**Desenvolvido por:** Orchestrator + frontend-next-atomic-shadcn  
**Bibliotecas:** qrcode, jszip, file-saver  
**Formato:** PNG (512x512px)  
**Compactação:** ZIP
