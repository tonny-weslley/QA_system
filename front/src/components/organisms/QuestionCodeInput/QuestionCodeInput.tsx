import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '../../atoms/Button';
import { Card, CardContent } from '../../molecules/Card';

interface QuestionCodeInputProps {
  onCodeSubmit: (code: string) => void;
}

export const QuestionCodeInput: React.FC<QuestionCodeInputProps> = ({ onCodeSubmit }) => {
  const [code, setCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerIdRef = useRef('qr-reader-' + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length === 5) {
      onCodeSubmit(code.trim());
    } else {
      setError('O código deve ter 5 caracteres');
    }
  };

  const startScanner = async () => {
    try {
      setError('');
      const html5QrCode = new Html5Qrcode(readerIdRef.current);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Extract code from URL or use directly
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

      setIsScanning(true);
    } catch (err) {
      setError('Erro ao acessar câmera. Verifique as permissões.');
      console.error(err);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          setIsScanning(false);
          scannerRef.current = null;
        })
        .catch(console.error);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-halloween-purple/10 to-halloween-orange/10 border-halloween-purple">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">🎃 Acesso Rápido</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="Digite o código (5 caracteres)"
              maxLength={5}
              className="h-10 flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-halloween-purple font-mono text-center text-lg"
            />
            <Button type="submit" disabled={code.length !== 5} className="sm:w-auto w-full">
              Ir
            </Button>
          </div>

          {error && (
            <p className="text-error text-sm text-center">{error}</p>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">ou</span>
            </div>
          </div>

          {!isScanning ? (
            <Button
              type="button"
              onClick={startScanner}
              variant="secondary"
              className="w-full"
            >
              📷 Escanear QR Code
            </Button>
          ) : (
            <>
              <div id={readerIdRef.current} className="rounded-lg overflow-hidden"></div>
              <Button
                type="button"
                onClick={stopScanner}
                variant="danger"
                className="w-full"
              >
                ❌ Cancelar Scanner
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
