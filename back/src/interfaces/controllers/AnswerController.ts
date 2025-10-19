import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { SubmitAnswer } from '../../usecases/answer/SubmitAnswer';
import { GetUserAnswers } from '../../usecases/answer/GetUserAnswers';
import { GetQuestionAnswers } from '../../usecases/answer/GetQuestionAnswers';
import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';
import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { IScoreRepository } from '../../domain/interfaces/IScoreRepository';

export class AnswerController {
  private submitAnswer: SubmitAnswer;
  private getUserAnswers: GetUserAnswers;
  private getQuestionAnswers: GetQuestionAnswers;

  constructor(
    answerRepository: IAnswerRepository,
    questionRepository: IQuestionRepository,
    scoreRepository: IScoreRepository
  ) {
    this.submitAnswer = new SubmitAnswer(answerRepository, questionRepository, scoreRepository);
    this.getUserAnswers = new GetUserAnswers(answerRepository);
    this.getQuestionAnswers = new GetQuestionAnswers(answerRepository);
  }

  async submit(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { questionId, selectedOptionId } = req.body;
      const userId = req.user!.userId;
      const username = req.user!.username;

      const result = await this.submitAnswer.execute(
        {
          questionId,
          userId,
          selectedOptionId,
        },
        username
      );

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getMyAnswers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const result = await this.getUserAnswers.execute(userId);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getQuestionAnswersHandler(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const result = await this.getQuestionAnswers.execute(id);

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
