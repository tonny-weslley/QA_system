import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { UpdateQuestionDTO, QuestionResponse } from '../../domain/entities/Question';

export class UpdateQuestion {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute(questionId: string, data: UpdateQuestionDTO): Promise<QuestionResponse> {
    // Validações
    if (data.statement !== undefined && data.statement.trim().length === 0) {
      throw new Error('Statement cannot be empty');
    }

    if (data.options) {
      if (data.options.length < 2 || data.options.length > 5) {
        throw new Error('Question must have between 2 and 5 options');
      }

      const hasCorrectOption = data.options.some((opt) => opt.isCorrect);
      if (!hasCorrectOption) {
        throw new Error('At least one option must be correct');
      }
    }

    const question = await this.questionRepository.update(questionId, data);

    if (!question) {
      throw new Error('Question not found');
    }

    return {
      id: question.id,
      code: question.code,
      statement: question.statement,
      options: question.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
      difficulty: question.difficulty,
      qrCodeUrl: question.qrCodeUrl,
      isLocked: question.isLocked,
      visible: question.visible,
      createdAt: question.createdAt,
    };
  }
}
