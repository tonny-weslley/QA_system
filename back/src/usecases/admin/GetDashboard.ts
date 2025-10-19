import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';
import { IScoreRepository } from '../../domain/interfaces/IScoreRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

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

export class GetDashboard {
  constructor(
    private questionRepository: IQuestionRepository,
    private answerRepository: IAnswerRepository,
    private scoreRepository: IScoreRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(): Promise<DashboardStats> {
    // Buscar dados
    const questions = await this.questionRepository.findAll();
    const answers = await this.answerRepository.findAll();
    const scores = await this.scoreRepository.findAll();
    const users = await this.userRepository.findAll();

    // Calcular estatísticas de perguntas
    const lockedQuestions = questions.filter((q) => q.isLocked).length;
    const availableQuestions = questions.length - lockedQuestions;

    // Top 10 scores
    const topScores = scores.slice(0, 10).map((score, index) => ({
      username: score.username,
      totalPoints: score.totalPoints,
      rank: index + 1,
    }));

    // Estatísticas por pergunta
    const questionStats = questions.map((question) => {
      const questionAnswers = answers.filter((a) => a.questionId === question.id);
      const correctAnswers = questionAnswers.filter((a) => a.isCorrect).length;

      return {
        questionId: question.id,
        statement: question.statement,
        difficulty: question.difficulty,
        totalAnswers: questionAnswers.length,
        correctAnswers,
        isLocked: question.isLocked,
      };
    });

    // Contar participantes e admins
    const participants = users.filter((u) => u.role === 'participant').length;
    const admins = users.filter((u) => u.role === 'admin').length;

    return {
      totalQuestions: questions.length,
      lockedQuestions,
      availableQuestions,
      totalAnswers: answers.length,
      totalParticipants: participants,
      totalAdmins: admins,
      topScores,
      questionStats,
    };
  }
}
