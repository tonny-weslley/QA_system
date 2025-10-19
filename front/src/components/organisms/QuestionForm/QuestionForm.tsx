import { useState, FormEvent } from 'react';
import { FormField } from '../../molecules/FormField';
import { Button } from '../../atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../molecules/Card';

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface QuestionFormData {
  statement: string;
  options: QuestionOption[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuestionFormProps {
  initialData?: QuestionFormData;
  onSubmit: (data: QuestionFormData) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

export const QuestionForm = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}: QuestionFormProps) => {
  const [statement, setStatement] = useState(initialData?.statement || '');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    initialData?.difficulty || 'easy'
  );
  const [options, setOptions] = useState<QuestionOption[]>(
    initialData?.options || [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, { text: '', isCorrect: false }]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!statement.trim()) {
      setError('Digite o enunciado da pergunta');
      return;
    }

    if (options.some((opt) => !opt.text.trim())) {
      setError('Preencha todas as opções');
      return;
    }

    if (!options.some((opt) => opt.isCorrect)) {
      setError('Marque pelo menos uma opção como correta');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({ statement, options, difficulty });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar pergunta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isEdit ? 'Editar Pergunta' : 'Nova Pergunta'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Enunciado"
            type="text"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            required
            placeholder="Digite a pergunta"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Dificuldade</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full h-10 rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-halloween-purple"
            >
              <option value="easy">Fácil (10 pontos)</option>
              <option value="medium">Médio (20 pontos)</option>
              <option value="hard">Difícil (30 pontos)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-200">Opções de Resposta</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 items-start">
                <input
                  type="radio"
                  name="correct"
                  checked={option.isCorrect}
                  onChange={() => handleCorrectChange(index)}
                  className="mt-3 w-4 h-4 text-halloween-purple"
                />
                <FormField
                  label=""
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Opção ${index + 1}`}
                  className="flex-1"
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    className="mt-2"
                  >
                    🗑️
                  </Button>
                )}
              </div>
            ))}
            {options.length < 5 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddOption}
              >
                + Adicionar Opção
              </Button>
            )}
          </div>

          {error && (
            <div
              className="p-3 rounded-md bg-error/10 border border-error/30 text-error text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              {isEdit ? 'Salvar Alterações' : 'Criar Pergunta'}
            </Button>
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
