import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';
import { Answer } from '../../domain/entities/Answer';

export interface QuestionAnswerStats {
  questionId: string;
  totalAnswers: number;
  correctAnswers: number;
  incorrectAnswers: number;
  answers: Answer[];
}

export class GetQuestionAnswers {
  constructor(private answerRepository: IAnswerRepository) {}

  async execute(questionId: string): Promise<QuestionAnswerStats> {
    const answers = await this.answerRepository.findByQuestionId(questionId);

    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const incorrectAnswers = answers.filter((a) => !a.isCorrect).length;

    return {
      questionId,
      totalAnswers: answers.length,
      correctAnswers,
      incorrectAnswers,
      answers,
    };
  }
}
