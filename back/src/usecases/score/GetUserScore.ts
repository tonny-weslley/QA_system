import { IScoreRepository } from '../../domain/interfaces/IScoreRepository';
import { Score } from '../../domain/entities/Score';

export class GetUserScore {
  constructor(private scoreRepository: IScoreRepository) {}

  async execute(userId: string): Promise<Score | null> {
    const score = await this.scoreRepository.findByUserId(userId);

    if (!score) {
      // Retornar score zerado se não existir
      return {
        userId,
        username: '',
        easyPoints: 0,
        mediumPoints: 0,
        hardPoints: 0,
        totalPoints: 0,
        updatedAt: new Date(),
      };
    }

    return score;
  }
}
