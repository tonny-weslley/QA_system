import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../../lib/api/admin';
import { useAuth } from '../../../lib/context/AuthContext';
import { AdminLayout } from '../../templates/AdminLayout';
import { AdminDashboard } from '../../organisms/AdminDashboard';
import type { DashboardStats } from '../../organisms/AdminDashboard';
import { AdminControls } from '../../organisms/AdminControls';
import { QuestionsVisibilityControl } from '../../organisms/QuestionsVisibilityControl';
import { Card, CardContent } from '../../molecules/Card';
import { Button } from '../../atoms/Button';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await adminApi.getDashboard();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetQuestions = async () => {
    try {
      await adminApi.resetQuestions();
      alert('Perguntas desbloqueadas com sucesso!');
      loadDashboard();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao desbloquear perguntas');
    }
  };

  const handleResetScores = async () => {
    try {
      await adminApi.resetScores();
      alert('Pontuações zeradas com sucesso!');
      loadDashboard();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao zerar pontuações');
    }
  };

  const handleFinalizeEvent = async () => {
    try {
      await adminApi.finalizeEvent();
      alert('Evento finalizado com sucesso!');
      navigate('/podium');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao finalizar evento');
    }
  };

  if (!user || user.role !== 'admin') {
    navigate('/questions');
    return null;
  }

  return (
    <AdminLayout
      username={user.username}
      onScoreboardClick={() => navigate('/scoreboard')}
      onLogout={logout}
    >
      <div className="space-y-6">
        {/* Botão de gerenciar perguntas */}
        <Card className="bg-gradient-to-r from-halloween-purple/10 to-halloween-orange/10 border-halloween-purple">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">📝 Gerenciar Perguntas</h3>
                <p className="text-gray-400 text-sm">
                  Criar, editar e deletar perguntas do quiz
                </p>
              </div>
              <Button onClick={() => navigate('/admin/questions')}>
                Gerenciar Perguntas →
              </Button>
            </div>
          </CardContent>
        </Card>

        <QuestionsVisibilityControl />

        <AdminControls
          onResetQuestions={handleResetQuestions}
          onResetScores={handleResetScores}
          onFinalizeEvent={handleFinalizeEvent}
        />

        {error && (
          <div className="p-4 rounded-md bg-error/10 border border-error/30 text-error">
            {error}
          </div>
        )}

        {stats && <AdminDashboard stats={stats} isLoading={isLoading} />}
      </div>
    </AdminLayout>
  );
};
