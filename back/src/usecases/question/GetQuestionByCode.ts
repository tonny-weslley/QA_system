import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';
import { QuestionResponse } from '../../domain/entities/Question';

export class GetQuestionByCode {
  constructor(
    private questionRepository: IQuestionRepository,
    private answerRepository: IAnswerRepository
  ) {}

  async execute(code: string, userId: string, isAdmin: boolean): Promise<QuestionResponse> {
    const question = await this.questionRepository.findByCode(code);

    if (!question) {
      throw new Error('Question not found');
    }

    // Se não for admin, validar se pode acessar
    if (!isAdmin) {
      // Verificar se a pergunta está visível
      if (!question.visible) {
        throw new Error('Question not found');
      }

      // Verificar se já respondeu
      const userAnswer = await this.answerRepository.findByUserAndQuestion(userId, question.id);
      if (userAnswer) {
        throw new Error('You have already answered this question');
      }

      // Verificar se está bloqueada
      if (question.isLocked) {
        throw new Error('This question is no longer available');
      }
    }

    return {
      id: question.id,
      code: question.code,
      statement: question.statement,
      options: question.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        ...(isAdmin && { isCorrect: opt.isCorrect }),
      })),
      difficulty: question.difficulty,
      qrCodeUrl: question.qrCodeUrl,
      isLocked: question.isLocked,
      visible: question.visible,
      createdAt: question.createdAt,
    };
  }
}
