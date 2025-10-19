import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { GetScoreboard } from '../../usecases/score/GetScoreboard';
import { GetUserScore } from '../../usecases/score/GetUserScore';
import { IScoreRepository } from '../../domain/interfaces/IScoreRepository';

export class ScoreController {
  private getScoreboard: GetScoreboard;
  private getUserScore: GetUserScore;

  constructor(scoreRepository: IScoreRepository) {
    this.getScoreboard = new GetScoreboard(scoreRepository);
    this.getUserScore = new GetUserScore(scoreRepository);
  }

  async scoreboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const isAdmin = req.user!.role === 'admin';

      const result = await this.getScoreboard.execute(isAdmin);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async myScore(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const result = await this.getUserScore.execute(userId);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
