import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../molecules/Card';
import { FormField } from '../../molecules/FormField';
import { Button } from '../../atoms/Button';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/questions');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-halloween-black via-halloween-purple/20 to-halloween-black">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-halloween-gradient font-creepster text-4xl">
            🎃 Halloween Quiz
          </CardTitle>
          <CardDescription className="text-center">
            Entre para participar do quiz
          </CardDescription>
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
            />
            <FormField
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
            />
            {error && (
              <div className="p-3 rounded-md bg-error/10 border border-error/30 text-error text-sm">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Entrar
            </Button>
            <div className="text-center text-sm text-gray-400">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-halloween-purple hover:underline"
              >
                Cadastre-se
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
