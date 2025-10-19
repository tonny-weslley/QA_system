import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';

export class DeleteQuestion {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute(questionId: string): Promise<void> {
    const deleted = await this.questionRepository.delete(questionId);

    if (!deleted) {
      throw new Error('Question not found');
    }
  }
}
