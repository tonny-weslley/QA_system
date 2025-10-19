import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scoresApi } from '../../../lib/api/scores';
import { useAuth } from '../../../lib/context/AuthContext';
import { MainLayout } from '../../templates/MainLayout';
import { Podium } from '../../organisms/Podium';
import type { PodiumEntry } from '../../organisms/Podium';
import { Scoreboard } from '../../organisms/Scoreboard';
import type { ScoreEntry } from '../../organisms/Scoreboard';
import { Button } from '../../atoms/Button';

export const PodiumPage = () => {
  const [topThree, setTopThree] = useState<PodiumEntry[]>([]);
  const [allScores, setAllScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const data = await scoresApi.getScoreboard();
      const scores = data.participants.map((p) => ({
        ...p,
        rank: p.rank,
        username: p.username,
        totalPoints: p.totalPoints,
      }));
      
      setTopThree(scores.slice(0, 3));
      setAllScores(scores);
    } catch (err) {
      console.error('Erro ao carregar scoreboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout
        username={user?.username || ''}
        isAdmin={user?.role === 'admin'}
        onLogout={logout}
      >
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-halloween-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando pódio...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      username={user?.username || ''}
      isAdmin={user?.role === 'admin'}
      onScoreboardClick={() => navigate('/scoreboard')}
      onAdminClick={() => navigate('/admin')}
      onLogout={logout}
    >
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-creepster text-halloween-gradient mb-2">
            🏆 Pódio Final
          </h1>
          <p className="text-gray-400">Parabéns aos vencedores!</p>
        </div>

        {topThree.length > 0 && <Podium topThree={topThree} />}

        <div className="max-w-4xl mx-auto">
          <Scoreboard
            scores={allScores}
            currentUsername={user?.username}
            title="Classificação Completa"
          />
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate('/questions')}>Ver Perguntas</Button>
          <Button variant="secondary" onClick={() => navigate('/scoreboard')}>
            Ver Ranking
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};
