import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { CreateQuestion } from '../../usecases/question/CreateQuestion';
import { ListQuestions } from '../../usecases/question/ListQuestions';
import { GetQuestionById } from '../../usecases/question/GetQuestionById';
import { UpdateQuestion } from '../../usecases/question/UpdateQuestion';
import { DeleteQuestion } from '../../usecases/question/DeleteQuestion';
import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';

export class QuestionController {
  private createQuestion: CreateQuestion;
  private listQuestions: ListQuestions;
  private getQuestionById: GetQuestionById;
  private updateQuestion: UpdateQuestion;
  private deleteQuestion: DeleteQuestion;

  constructor(questionRepository: IQuestionRepository, answerRepository: IAnswerRepository) {
    this.createQuestion = new CreateQuestion(questionRepository);
    this.listQuestions = new ListQuestions(questionRepository, answerRepository);
    this.getQuestionById = new GetQuestionById(questionRepository, answerRepository);
    this.updateQuestion = new UpdateQuestion(questionRepository);
    this.deleteQuestion = new DeleteQuestion(questionRepository);
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { statement, options, difficulty } = req.body;
      const createdBy = req.user!.userId;

      const result = await this.createQuestion.execute({
        statement,
        options,
        difficulty,
        createdBy,
      });

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const isAdmin = req.user!.role === 'admin';

      const result = await this.listQuestions.execute(userId, isAdmin);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const isAdmin = req.user!.role === 'admin';

      const result = await this.getQuestionById.execute(id, userId, isAdmin);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { statement, options, difficulty } = req.body;

      const result = await this.updateQuestion.execute(id, {
        statement,
        options,
        difficulty,
      });

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.deleteQuestion.execute(id);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
