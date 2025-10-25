import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scoresApi } from '../../../lib/api/scores';
import type { ScoreboardEntry } from '../../../lib/api/scores';
import { useAuth } from '../../../lib/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../molecules/Card';
import { Button } from '../../atoms/Button';

export const Scoreboard = () => {
  const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadScoreboard();
  }, []);

  const loadScoreboard = async () => {
    try {
      const data = await scoresApi.getScoreboard();
      setScoreboard(data.participants);
    } catch (err) {
      console.error('Erro ao carregar scoreboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}º`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-halloween-black via-halloween-purple/10 to-halloween-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-halloween-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando ranking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-halloween-black via-halloween-purple/10 to-halloween-black">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-creepster text-halloween-gradient">🎃 Halloween Quiz</h1>
          <Button variant="ghost" onClick={() => navigate('/questions')} size="sm">
            ← Voltar
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-creepster text-halloween-gradient mb-2">
            🏆 Ranking
          </h2>
          <p className="text-sm sm:text-base text-gray-400">Veja quem está no topo!</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Classificação Geral</CardTitle>
          </CardHeader>
          <CardContent>
            {scoreboard.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                Nenhuma pontuação registrada ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {scoreboard.map((entry) => (
                  <div
                    key={entry.username}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      entry.username === user?.username
                        ? 'bg-halloween-purple/20 border-2 border-halloween-purple'
                        : 'bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold w-12 text-center">
                        {getMedalEmoji(entry.rank)}
                      </span>
                      <div>
                        <p className="font-semibold">
                          {entry.username}
                          {entry.username === user?.username && (
                            <span className="ml-2 text-xs text-halloween-orange">(Você)</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-halloween-orange">
                        {entry.totalPoints}
                      </p>
                      <p className="text-xs text-gray-400">pontos</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
