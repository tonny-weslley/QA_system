import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';
import { AnswerResponse } from '../../domain/entities/Answer';

export class GetUserAnswers {
  constructor(private answerRepository: IAnswerRepository) {}

  async execute(userId: string): Promise<AnswerResponse[]> {
    const answers = await this.answerRepository.findByUserId(userId);

    return answers.map((answer) => ({
      id: answer.id,
      questionId: answer.questionId,
      isCorrect: answer.isCorrect,
      pointsEarned: answer.pointsEarned,
      answeredAt: answer.answeredAt,
    }));
  }
}
