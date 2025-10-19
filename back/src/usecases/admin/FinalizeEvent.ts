import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { IScoreRepository } from '../../domain/interfaces/IScoreRepository';
import { AdminScoreboardEntry } from '../../domain/entities/Score';

export interface FinalizeEventResponse {
  message: string;
  finalScoreboard: AdminScoreboardEntry[];
  totalQuestions: number;
  totalParticipants: number;
}

export class FinalizeEvent {
  constructor(
    private questionRepository: IQuestionRepository,
    private scoreRepository: IScoreRepository
  ) {}

  async execute(): Promise<FinalizeEventResponse> {
    // Bloquear todas as perguntas
    const questions = await this.questionRepository.findAll();
    for (const question of questions) {
      if (!question.isLocked) {
        await this.questionRepository.lockQuestion(question.id);
      }
    }

    // Obter scoreboard final
    const scores = await this.scoreRepository.findAll();
    const finalScoreboard: AdminScoreboardEntry[] = scores.map((score, index) => ({
      rank: index + 1,
      username: score.username,
      totalPoints: score.totalPoints,
      easyPoints: score.easyPoints,
      mediumPoints: score.mediumPoints,
      hardPoints: score.hardPoints,
    }));

    return {
      message: 'Event finalized successfully',
      finalScoreboard,
      totalQuestions: questions.length,
      totalParticipants: scores.length,
    };
  }
}
