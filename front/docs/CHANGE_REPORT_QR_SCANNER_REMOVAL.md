# CHANGE REPORT - Remoção do Scanner QR Code

**Data:** 2025-10-25  
**Componente:** QuestionCodeInput  
**Camada atômica:** Organismo  
**Tipo:** Feature Removal

## Resumo
Removida completamente a funcionalidade de scanner QR Code do componente `QuestionCodeInput`, mantendo apenas a entrada manual de código.

## Motivação
Simplificação do componente, removendo funcionalidade de scanner QR Code conforme solicitado.

## Arquivos modificados

### `/front/src/components/organisms/QuestionCodeInput/QuestionCodeInput.tsx`
**Removido:**
- Import de `useRef` e `useEffect` do React
- Import da biblioteca `html5-qrcode`
- State `isScanning`
- Refs `scannerRef` e `readerIdRef`
- Hook `useEffect` para cleanup do scanner
- Função `startScanner()`
- Função `stopScanner()`
- Divisor visual "ou"
- Botão "Escanear QR Code"
- Elemento do scanner (`<div id={readerIdRef.current}>`)
- Botão "Cancelar Scanner"

**Mantido:**
- State `code` e `error`
- Função `handleSubmit()`
- Input de texto para código manual
- Botão "Ir"
- Validação de código (5 caracteres)
- Estilização e layout do card

## Código final
O componente agora possui apenas:
- 53 linhas (vs 148 anteriormente)
- 1 import do React (`useState`)
- 2 states (`code`, `error`)
- 1 função (`handleSubmit`)
- UI simplificada com input + botão

## Validações realizadas
- ✅ Componente compila sem erros
- ✅ Lint executado sem novos erros
- ✅ Funcionalidade de entrada manual preservada
- ✅ Validação de código mantida
- ✅ Estilização preservada

## Impacto
- **Usuários:** Agora só podem inserir código manualmente (sem scanner)
- **Bundle size:** Redução significativa (biblioteca `html5-qrcode` não é mais necessária)
- **Complexidade:** Componente muito mais simples e fácil de manter
- **Performance:** Melhor performance (sem overhead de câmera/scanner)

## Dependências
A biblioteca `html5-qrcode` não está sendo usada em nenhum outro lugar do projeto e pode ser removida do `package.json` se desejado:

```bash
npm uninstall html5-qrcode
```

## Documentação atualizada
- ✅ Change report criado
- ⏳ README (não requer atualização - simplificação)
- ⏳ Storybook (não requer atualização - funcionalidade removida)

## Próximos passos (opcional)
- Remover dependência `html5-qrcode` do package.json
- Atualizar documentação de usuário se houver menção ao scanner
- Considerar adicionar tooltip explicando como obter códigos
