import { Score } from '../entities/Score';

export interface IScoreRepository {
  findByUserId(userId: string): Promise<Score | null>;
  findAll(): Promise<Score[]>;
  updateScore(
    userId: string,
    username: string,
    points: number,
    difficulty: 'easy' | 'medium' | 'hard'
  ): Promise<Score>;
  resetAll(): Promise<boolean>;
}
