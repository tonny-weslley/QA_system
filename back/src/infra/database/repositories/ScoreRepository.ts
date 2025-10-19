import { Collection } from 'mongodb';
import { IScoreRepository } from '../../../domain/interfaces/IScoreRepository';
import { Score } from '../../../domain/entities/Score';
import { DatabaseConfig } from '../../../config/database';

export class ScoreRepository implements IScoreRepository {
  private collection: Collection;

  constructor() {
    const db = DatabaseConfig.getDb();
    this.collection = db.collection('scores');
  }

  async findByUserId(userId: string): Promise<Score | null> {
    const score = await this.collection.findOne({ userId });
    if (!score) return null;

    return {
      userId: score.userId,
      username: score.username,
      easyPoints: score.easyPoints,
      mediumPoints: score.mediumPoints,
      hardPoints: score.hardPoints,
      totalPoints: score.totalPoints,
      updatedAt: score.updatedAt,
    };
  }

  async findAll(): Promise<Score[]> {
    const scores = await this.collection.find({}).sort({ totalPoints: -1 }).toArray();
    return scores.map((s) => ({
      userId: s.userId,
      username: s.username,
      easyPoints: s.easyPoints,
      mediumPoints: s.mediumPoints,
      hardPoints: s.hardPoints,
      totalPoints: s.totalPoints,
      updatedAt: s.updatedAt,
    }));
  }

  async updateScore(
    userId: string,
    username: string,
    points: number,
    difficulty: 'easy' | 'medium' | 'hard'
  ): Promise<Score> {
    const difficultyField = `${difficulty}Points`;
    const now = new Date();

    // Buscar score existente
    const existingScore = await this.collection.findOne({ userId });

    if (existingScore) {
      // Atualizar score existente
      const newDifficultyPoints = existingScore[difficultyField] + points;
      const newTotalPoints = existingScore.totalPoints + points;

      await this.collection.updateOne(
        { userId },
        {
          $set: {
            [difficultyField]: newDifficultyPoints,
            totalPoints: newTotalPoints,
            updatedAt: now,
          },
        }
      );

      return {
        userId,
        username: existingScore.username,
        easyPoints: difficulty === 'easy' ? newDifficultyPoints : existingScore.easyPoints,
        mediumPoints: difficulty === 'medium' ? newDifficultyPoints : existingScore.mediumPoints,
        hardPoints: difficulty === 'hard' ? newDifficultyPoints : existingScore.hardPoints,
        totalPoints: newTotalPoints,
        updatedAt: now,
      };
    } else {
      // Criar novo score
      const newScore = {
        userId,
        username,
        easyPoints: difficulty === 'easy' ? points : 0,
        mediumPoints: difficulty === 'medium' ? points : 0,
        hardPoints: difficulty === 'hard' ? points : 0,
        totalPoints: points,
        updatedAt: now,
      };

      await this.collection.insertOne(newScore);

      return newScore;
    }
  }

  async resetAll(): Promise<boolean> {
    await this.collection.deleteMany({});
    return true;
  }
}
