# QR Scanner - Câmera não abre após permissão

## Descrição
Ao clicar no botão "Escanear QR Code" no componente `QuestionCodeInput`, o navegador solicita permissão para usar a câmera, mas após conceder a permissão, a câmera não é aberta e o scanner não funciona.

## Causa
O problema estava na ordem de execução do código no método `startScanner()`:

1. O elemento DOM `<div id={readerIdRef.current}>` só era renderizado quando `isScanning` era `true`
2. Porém, o código tentava inicializar o `Html5Qrcode` **antes** de definir `isScanning = true`
3. Resultado: o `Html5Qrcode` tentava acessar um elemento que ainda não existia no DOM

### Código problemático (antes):
```typescript
const startScanner = async () => {
  try {
    setError('');
    const html5QrCode = new Html5Qrcode(readerIdRef.current); // ❌ Elemento não existe ainda
    scannerRef.current = html5QrCode;

    await html5QrCode.start(...);
    
    setIsScanning(true); // ✅ Só agora o elemento é renderizado
  } catch (err) {
    setError('Erro ao acessar câmera. Verifique as permissões.');
    console.error(err);
  }
};
```

## Solução
Reordenar a execução para garantir que o elemento DOM exista antes de inicializar o scanner:

1. Primeiro, definir `setIsScanning(true)` para renderizar o elemento
2. Aguardar um ciclo de renderização com `setTimeout`
3. Depois, inicializar o `Html5Qrcode`

### Código corrigido:
```typescript
const startScanner = async () => {
  try {
    setError('');
    setIsScanning(true); // ✅ Renderiza o elemento primeiro
    
    // Aguardar o próximo ciclo de renderização para garantir que o elemento existe
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const html5QrCode = new Html5Qrcode(readerIdRef.current); // ✅ Agora o elemento existe
    scannerRef.current = html5QrCode;

    await html5QrCode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        const match = decodedText.match(/\/questions\/([A-Za-z0-9]{5})$/);
        const extractedCode = match ? match[1] : decodedText;

        if (/^[A-Za-z0-9]{5}$/.test(extractedCode)) {
          stopScanner();
          onCodeSubmit(extractedCode);
        }
      },
      () => {
        // Ignore scan errors
      }
    );
  } catch (err) {
    setError('Erro ao acessar câmera. Verifique as permissões.');
    setIsScanning(false); // ✅ Resetar estado em caso de erro
    console.error(err);
  }
};
```

## Arquivos alterados
- `/front/src/components/organisms/QuestionCodeInput/QuestionCodeInput.tsx`

## Validação
- ✅ Câmera abre corretamente após permissão
- ✅ Scanner funciona e detecta QR Codes
- ✅ Tratamento de erro adequado
- ✅ Estado resetado corretamente em caso de falha

## Lições aprendidas
- Ao trabalhar com bibliotecas que manipulam o DOM (como `html5-qrcode`), sempre garantir que os elementos existam antes de inicializá-las
- React renderiza de forma assíncrona, então mudanças de estado não são imediatas
- Usar `setTimeout` com Promise é uma técnica válida para aguardar o próximo ciclo de renderização
- Sempre resetar estados em blocos `catch` para evitar estados inconsistentes na UI
