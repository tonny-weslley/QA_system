import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';

export class ResetQuestions {
  constructor(private questionRepository: IQuestionRepository) {}

  async execute(): Promise<{ message: string; unlockedCount: number }> {
    const unlocked = await this.questionRepository.unlockAll();

    return {
      message: 'All questions have been unlocked',
      unlockedCount: unlocked ? 1 : 0,
    };
  }
}
