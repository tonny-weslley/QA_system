import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';
import { QuestionResponse } from '../../domain/entities/Question';

export class ListQuestions {
  constructor(
    private questionRepository: IQuestionRepository,
    private answerRepository: IAnswerRepository
  ) {}

  async execute(userId: string, isAdmin: boolean): Promise<QuestionResponse[]> {
    let questions;

    if (isAdmin) {
      // Admin vê todas as perguntas
      questions = await this.questionRepository.findAll();
    } else {
      // Participante vê apenas perguntas visíveis, disponíveis e não respondidas
      const allQuestions = await this.questionRepository.findVisible();
      const userAnswers = await this.answerRepository.findByUserId(userId);
      const answeredQuestionIds = new Set(userAnswers.map((a) => a.questionId));

      // Filtrar perguntas não bloqueadas e não respondidas
      questions = allQuestions.filter(
        (q) => !q.isLocked && !answeredQuestionIds.has(q.id)
      );
    }

    // Remover indicação de resposta correta para participantes
    return questions.map((q) => ({
      id: q.id,
      code: q.code,
      statement: q.statement,
      options: q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        ...(isAdmin && { isCorrect: opt.isCorrect }),
      })),
      difficulty: q.difficulty,
      qrCodeUrl: q.qrCodeUrl,
      isLocked: q.isLocked,
      visible: q.visible,
      createdAt: q.createdAt,
    }));
  }
}
