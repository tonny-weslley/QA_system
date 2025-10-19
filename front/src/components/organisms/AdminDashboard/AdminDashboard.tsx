import { HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../molecules/Card';
import { Badge } from '../../atoms/Badge';

export interface DashboardStats {
  totalQuestions: number;
  lockedQuestions: number;
  availableQuestions: number;
  totalAnswers: number;
  totalParticipants: number;
  totalAdmins: number;
  topScores: Array<{
    username: string;
    totalPoints: number;
    rank: number;
  }>;
  questionStats: Array<{
    questionId: string;
    statement: string;
    difficulty: string;
    totalAnswers: number;
    correctAnswers: number;
    isLocked: boolean;
  }>;
}

export interface AdminDashboardProps extends HTMLAttributes<HTMLDivElement> {
  stats: DashboardStats;
  isLoading?: boolean;
}

export const AdminDashboard = ({
  stats,
  isLoading = false,
  className,
  ...props
}: AdminDashboardProps) => {
  if (isLoading) {
    return (
      <div className={cn('w-full', className)} {...props}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-halloween-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  const getAccuracyRate = (correct: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  return (
    <div className={cn('w-full space-y-6', className)} {...props}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Total de Perguntas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-halloween-purple">{stats.totalQuestions}</p>
            <div className="flex gap-2 mt-2 text-xs">
              <Badge variant="success">{stats.availableQuestions} disponíveis</Badge>
              <Badge variant="error">{stats.lockedQuestions} bloqueadas</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Total de Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-halloween-orange">{stats.totalAnswers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">{stats.totalParticipants}</p>
            <p className="text-xs text-gray-400 mt-2">{stats.totalAdmins} admins</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Participantes</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topScores.length === 0 ? (
            <p className="text-center text-gray-400 py-4">Nenhuma pontuação ainda</p>
          ) : (
            <div className="space-y-2">
              {stats.topScores.map((score) => (
                <div
                  key={score.username}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold w-8">{score.rank}º</span>
                    <span>{score.username}</span>
                  </div>
                  <span className="text-halloween-orange font-bold">{score.totalPoints}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas por Pergunta</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.questionStats.length === 0 ? (
            <p className="text-center text-gray-400 py-4">Nenhuma pergunta cadastrada</p>
          ) : (
            <div className="space-y-3">
              {stats.questionStats.map((question) => (
                <div
                  key={question.questionId}
                  className="p-4 rounded-lg bg-gray-800/50 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex-1 line-clamp-2">{question.statement}</p>
                    <div className="flex gap-2">
                      <Badge variant={question.difficulty as any}>
                        {question.difficulty.toUpperCase()}
                      </Badge>
                      {question.isLocked && <Badge variant="error">🔒</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>{question.totalAnswers} respostas</span>
                    <span>
                      {question.correctAnswers} corretas (
                      {getAccuracyRate(question.correctAnswers, question.totalAnswers)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
