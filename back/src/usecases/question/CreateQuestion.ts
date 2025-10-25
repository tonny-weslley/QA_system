import QRCode from 'qrcode';
import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { CreateQuestionDTO, QuestionResponse } from '../../domain/entities/Question';

export class CreateQuestion {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute(data: CreateQuestionDTO): Promise<QuestionResponse> {
    // Validações
    if (!data.statement || data.statement.trim().length === 0) {
      throw new Error('Statement cannot be empty');
    }

    if (!data.options || data.options.length < 2 || data.options.length > 5) {
      throw new Error('Question must have between 2 and 5 options');
    }

    const hasCorrectOption = data.options.some((opt) => opt.isCorrect);
    if (!hasCorrectOption) {
      throw new Error('At least one option must be correct');
    }

    // Criar pergunta
    const question = await this.questionRepository.create(data);

    // Gerar QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(question.qrCodeUrl);

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
      qrCodeUrl: qrCodeDataUrl,
      isLocked: question.isLocked,
      visible: question.visible,
      createdAt: question.createdAt,
    };
  }
}
