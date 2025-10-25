import { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../molecules/Card';

export interface AdminControlsProps {
  onResetQuestions?: () => Promise<void>;
  onResetScores?: () => Promise<void>;
  onFinalizeEvent?: () => Promise<void>;
}

export const AdminControls = ({
  onResetQuestions,
  onResetScores,
  onFinalizeEvent,
}: AdminControlsProps) => {
  const [isResettingQuestions, setIsResettingQuestions] = useState(false);
  const [isResettingScores, setIsResettingScores] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const handleResetQuestions = async () => {
    if (!confirm('Tem certeza que deseja desbloquear todas as perguntas?')) return;
    
    setIsResettingQuestions(true);
    try {
      await onResetQuestions?.();
    } finally {
      setIsResettingQuestions(false);
    }
  };

  const handleResetScores = async () => {
    if (!confirm('Tem certeza que deseja zerar todas as pontuações? Esta ação não pode ser desfeita!')) return;
    
    setIsResettingScores(true);
    try {
      await onResetScores?.();
    } finally {
      setIsResettingScores(false);
    }
  };

  const handleFinalizeEvent = async () => {
    if (!confirm('Tem certeza que deseja finalizar o evento? Todas as perguntas serão bloqueadas!')) return;
    
    setIsFinalizing(true);
    try {
      await onFinalizeEvent?.();
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🔓 Desbloquear Perguntas</CardTitle>
          <CardDescription>Libera todas as perguntas bloqueadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleResetQuestions}
            isLoading={isResettingQuestions}
            disabled={!onResetQuestions}
          >
            Desbloquear Todas
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🔄 Zerar Pontuações</CardTitle>
          <CardDescription>Remove todas as pontuações dos participantes</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="danger"
            className="w-full"
            onClick={handleResetScores}
            isLoading={isResettingScores}
            disabled={!onResetScores}
          >
            Zerar Pontuações
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🏁 Finalizar Evento</CardTitle>
          <CardDescription>Bloqueia todas as perguntas e encerra o quiz</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="danger"
            className="w-full"
            onClick={handleFinalizeEvent}
            isLoading={isFinalizing}
            disabled={!onFinalizeEvent}
          >
            Finalizar Evento
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
