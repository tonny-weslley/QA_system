import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { ResetQuestions } from '../../usecases/admin/ResetQuestions';
import { ResetScores } from '../../usecases/admin/ResetScores';
import { FinalizeEvent } from '../../usecases/admin/FinalizeEvent';
import { GetDashboard } from '../../usecases/admin/GetDashboard';
import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';
import { IScoreRepository } from '../../domain/interfaces/IScoreRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

export class AdminController {
  private resetQuestions: ResetQuestions;
  private resetScores: ResetScores;
  private finalizeEvent: FinalizeEvent;
  private getDashboard: GetDashboard;

  constructor(
    questionRepository: IQuestionRepository,
    answerRepository: IAnswerRepository,
    scoreRepository: IScoreRepository,
    userRepository: IUserRepository
  ) {
    this.resetQuestions = new ResetQuestions(questionRepository);
    this.resetScores = new ResetScores(scoreRepository);
    this.finalizeEvent = new FinalizeEvent(questionRepository, scoreRepository);
    this.getDashboard = new GetDashboard(
      questionRepository,
      answerRepository,
      scoreRepository,
      userRepository
    );
  }

  async resetQuestionsHandler(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.resetQuestions.execute();
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async resetScoresHandler(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.resetScores.execute();
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async finalizeEventHandler(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.finalizeEvent.execute();
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async dashboardHandler(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await this.getDashboard.execute();
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
