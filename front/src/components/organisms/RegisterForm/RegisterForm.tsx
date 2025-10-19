import { useState, FormEvent } from 'react';
import { FormField } from '../../molecules/FormField';
import { Button } from '../../atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../molecules/Card';

export interface RegisterFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  onLoginClick?: () => void;
}

export const RegisterForm = ({ onSubmit, onLoginClick }: RegisterFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (username.length < 3) {
      setError('Username deve ter pelo menos 3 caracteres');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(username, password);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center text-halloween-gradient font-creepster text-4xl">
          🎃 Criar Conta
        </CardTitle>
        <CardDescription className="text-center">
          Cadastre-se para participar do quiz
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
            placeholder="Escolha um username"
            helperText="Mínimo 3 caracteres"
            autoComplete="username"
          />
          <FormField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Crie uma senha"
            helperText="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
          <FormField
            label="Confirmar Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Digite a senha novamente"
            autoComplete="new-password"
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
            Criar Conta
          </Button>
          {onLoginClick && (
            <div className="text-center text-sm text-gray-400">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={onLoginClick}
                className="text-halloween-purple hover:underline focus:outline-none focus:underline"
              >
                Faça login
              </button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
