import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';

export class ToggleQuestionLock {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute(id: string, isLocked: boolean): Promise<void> {
    const question = await this.questionRepository.findById(id);
    
    if (!question) {
      throw new Error('Question not found');
    }

    await this.questionRepository.update(id, { isLocked });
  }
}
