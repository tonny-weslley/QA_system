import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { questionsApi } from '../../../lib/api/questions';
import type { Question } from '../../../lib/api/questions';
import { configApi } from '../../../lib/api/config';
import { useAuth } from '../../../lib/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../molecules/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Scoreboard } from '../../organisms/Scoreboard';
import type { ScoreEntry } from '../../organisms/Scoreboard';
import { scoresApi } from '../../../lib/api/scores';
import { containerVariants, itemVariants } from '../../../lib/utils/animations';

export const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [questionsVisible, setQuestionsVisible] = useState(true);
  const [scoreboard, setScoreboard] = useState<ScoreEntry[]>([]);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar configuração
      const configs = await configApi.getAll();
      const visible = configs['questions.visible'] as boolean;
      setQuestionsVisible(visible);

      // Se admin, sempre mostrar perguntas
      if (isAdmin || visible) {
        const questionsData = await questionsApi.getAll();
        setQuestions(questionsData);
      } else {
        // Se não admin e perguntas ocultas, carregar scoreboard
        const scoreData = await scoresApi.getScoreboard();
        setScoreboard(scoreData.participants.map((p, index) => ({
          rank: index + 1,
          username: p.username,
          totalPoints: p.totalPoints,
        })));
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'easy';
      case 'medium': return 'medium';
      case 'hard': return 'hard';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-halloween-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando perguntas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-halloween-black via-halloween-purple/10 to-halloween-black">
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-creepster text-halloween-gradient">🎃 Halloween Quiz</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Olá, <span className="text-halloween-purple font-semibold">{user?.username}</span>
              {isAdmin && <Badge variant="default" className="ml-2">Admin</Badge>}
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/scoreboard')}>
              🏆 Ranking
            </Button>
            {isAdmin && (
              <Button variant="secondary" size="sm" onClick={() => navigate('/admin')}>
                ⚙️ Admin
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-md bg-error/10 border border-error/30 text-error">
            {error}
          </div>
        )}

        {/* Se perguntas estão ocultas e não é admin, mostrar scoreboard + QR Code */}
        {!questionsVisible && !isAdmin ? (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-halloween-purple/10 to-halloween-orange/10 border-halloween-purple">
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">📱 Escaneie o QR Code</h2>
                <p className="text-gray-300 mb-4">
                  As perguntas estão disponíveis apenas via QR Code.
                  Escaneie o código da pergunta para responder!
                </p>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => navigate('/scoreboard')}>
                    🏆 Ver Ranking Completo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-bold mb-4">🏆 Ranking Atual</h2>
              <Scoreboard 
                scores={scoreboard}
                currentUser={user?.username}
                showDetails={false}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Perguntas Disponíveis</h2>
              <p className="text-gray-400">Escolha uma pergunta para responder</p>
            </div>

            {questions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-400 text-lg">Nenhuma pergunta disponível no momento.</p>
                </CardContent>
              </Card>
            ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {questions.map((question, index) => (
              <motion.div key={question.id} variants={itemVariants} custom={index}>
              <Card className="hover:border-halloween-purple/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={getDifficultyVariant(question.difficulty)}>
                      {question.difficulty.toUpperCase()}
                    </Badge>
                    {question.isLocked && (
                      <Badge variant="error">🔒 Bloqueada</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {question.statement}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/questions/${question.id}`)}
                    disabled={question.isLocked}
                  >
                    {question.isLocked ? 'Bloqueada' : 'Responder'}
                  </Button>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
