import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { questionsApi } from '../../../lib/api/questions';
import type { Question } from '../../../lib/api/questions';
import { answersApi } from '../../../lib/api/answers';
import { Card, CardContent, CardHeader, CardTitle } from '../../molecules/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { triggerConfetti } from '../../../lib/utils/confetti';

export const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadQuestion = async () => {
    try {
      // Verificar se é um código (5 caracteres alfanuméricos) ou ID
      const isCode = /^[A-Za-z0-9]{5}$/.test(id!);
      
      const data = isCode 
        ? await questionsApi.getByCode(id!)
        : await questionsApi.getById(id!);
      
      setQuestion(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar pergunta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      setError('Selecione uma opção');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await answersApi.submit({
        questionId: id!,
        selectedOptionId: selectedOption,
      });
      setResult(response);
      
      // Trigger confetti if correct
      if (response.isCorrect) {
        triggerConfetti();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao enviar resposta');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-halloween-black via-halloween-purple/10 to-halloween-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-halloween-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando pergunta...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-halloween-black via-halloween-purple/10 to-halloween-black">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-full max-w-2xl"
        >
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">
              {result.isCorrect ? (
                <span className="text-success text-4xl">🎉 Parabéns!</span>
              ) : (
                <span className="text-error text-4xl">😢 Ops!</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-xl">
              {result.isCorrect ? 'Você acertou!' : 'Você errou!'}
            </p>
            <p className="text-3xl font-bold text-halloween-orange">
              +{result.pointsEarned} pontos
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={() => navigate('/questions')}>
                Ver Perguntas
              </Button>
              <Button variant="secondary" onClick={() => navigate('/scoreboard')}>
                Ver Ranking
              </Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-halloween-black via-halloween-purple/10 to-halloween-black">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-error mb-4">{error || 'Pergunta não encontrada'}</p>
            <Button onClick={() => navigate('/questions')}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-halloween-black via-halloween-purple/10 to-halloween-black p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate('/questions')} className="mb-6">
          ← Voltar
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <Badge variant={question.difficulty as any}>
                {question.difficulty.toUpperCase()}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{question.statement}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-error/10 border border-error/30 text-error text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedOption === option.id
                      ? 'border-halloween-purple bg-halloween-purple/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={!selectedOption || isSubmitting}
              isLoading={isSubmitting}
            >
              Enviar Resposta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
