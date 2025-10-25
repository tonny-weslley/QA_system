import { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Card, CardContent } from '../../molecules/Card';

interface QuestionCodeInputProps {
  onCodeSubmit: (code: string) => void;
}

export const QuestionCodeInput: React.FC<QuestionCodeInputProps> = ({ onCodeSubmit }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length === 5) {
      onCodeSubmit(code.trim());
    } else {
      setError('O código deve ter 5 caracteres');
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
                setCode(e.target.value);
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

          {error && <p className="text-error text-sm text-center">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
};
