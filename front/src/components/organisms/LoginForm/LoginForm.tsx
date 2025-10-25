import { useState, FormEvent } from 'react';
import { FormField } from '../../molecules/FormField';
import { Button } from '../../atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../molecules/Card';

export interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  onRegisterClick?: () => void;
}

export const LoginForm = ({ onSubmit, onRegisterClick }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(username, password);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-halloween-gradient font-creepster text-4xl">
          🎃 Halloween Quiz
        </CardTitle>
        <CardDescription className="text-center">Entre para participar do quiz</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Digite seu username"
            autoComplete="username"
          />
          <FormField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Digite sua senha"
            autoComplete="current-password"
          />
          {error && (
            <div
              className="p-3 rounded-md bg-error/10 border border-error/30 text-error text-sm"
              role="alert"
            >
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Entrar
          </Button>
          {onRegisterClick && (
            <div className="text-center text-sm text-gray-400">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={onRegisterClick}
                className="text-halloween-purple hover:underline focus:outline-none focus:underline"
              >
                Cadastre-se
              </button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
