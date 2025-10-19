import { IScoreRepository } from '../../domain/interfaces/IScoreRepository';

export class ResetScores {
  constructor(private scoreRepository: IScoreRepository) {}

  async execute(): Promise<{ message: string }> {
    await this.scoreRepository.resetAll();

    return {
      message: 'All scores have been reset',
    };
  }
}
