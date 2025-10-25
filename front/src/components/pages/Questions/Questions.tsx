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
import { QuestionCodeInput } from '../../organisms/QuestionCodeInput';
import { containerVariants, itemVariants } from '../../../lib/utils/animations';

export const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [questionsVisible, setQuestionsVisible] = useState(true);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      // Carregar configuração de visibilidade (apenas para não-admins)
      if (!isAdmin) {
        try {
          const configs = await configApi.getAll();
          setQuestionsVisible(configs['questions.visible'] as boolean);
        } catch {
          // Se falhar, assume visível
          setQuestionsVisible(true);
        }
      }

      // Sempre carregar perguntas (backend filtra automaticamente)
      const questionsData = await questionsApi.getAll();
      setQuestions(questionsData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (code: string) => {
    try {
      // Redirecionar para a pergunta usando o código
      navigate(`/questions/${code}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Código inválido');
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-creepster text-halloween-gradient">🎃 Halloween Quiz</h1>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-gray-400">
              Olá, <span className="text-halloween-purple font-semibold">{user?.username}</span>
              {isAdmin && <Badge variant="default" className="ml-2">Admin</Badge>}
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/scoreboard')} className="text-xs sm:text-sm px-2 sm:px-4">
              🏆 Ranking
            </Button>
            {isAdmin && (
              <Button variant="secondary" size="sm" onClick={() => navigate('/admin')} className="text-xs sm:text-sm px-2 sm:px-4">
                ⚙️ Admin
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={logout} className="text-xs sm:text-sm px-2 sm:px-4">
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

        {/* Exibir perguntas */}
        <>
          {/* Input de código */}
          <div className="mb-8">
            <QuestionCodeInput onCodeSubmit={handleCodeSubmit} />
          </div>

          {/* Mostrar lista de perguntas apenas se for admin OU se questionsVisible estiver habilitado */}
          {(isAdmin || questionsVisible) && (
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

          {/* Mensagem quando lista está desabilitada */}
          {!isAdmin && !questionsVisible && (
            <Card className="border-halloween-orange/50">
              <CardContent className="text-center py-12">
                <p className="text-2xl mb-4">🎃</p>
                <p className="text-lg font-medium mb-2">Modo QR Code Ativo</p>
                <p className="text-gray-400">
                  Use o campo acima para digitar um código ou escanear um QR Code para acessar as perguntas.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      </div>
    </div>
  );
};
