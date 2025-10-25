import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { CreateQuestion } from '../../usecases/question/CreateQuestion';
import { ListQuestions } from '../../usecases/question/ListQuestions';
import { GetQuestionById } from '../../usecases/question/GetQuestionById';
import { GetQuestionByCode } from '../../usecases/question/GetQuestionByCode';
import { UpdateQuestion } from '../../usecases/question/UpdateQuestion';
import { DeleteQuestion } from '../../usecases/question/DeleteQuestion';
import { UpdateQuestionVisibility } from '../../usecases/question/UpdateQuestionVisibility';
import { UpdateAllQuestionsVisibility } from '../../usecases/question/UpdateAllQuestionsVisibility';
import { ToggleQuestionLock } from '../../usecases/question/ToggleQuestionLock';
import { IQuestionRepository } from '../../domain/interfaces/IQuestionRepository';
import { IAnswerRepository } from '../../domain/interfaces/IAnswerRepository';

export class QuestionController {
  private createQuestion: CreateQuestion;
  private listQuestions: ListQuestions;
  private getQuestionById: GetQuestionById;
  private getQuestionByCode: GetQuestionByCode;
  private updateQuestion: UpdateQuestion;
  private deleteQuestion: DeleteQuestion;
  private updateQuestionVisibility: UpdateQuestionVisibility;
  private updateAllQuestionsVisibility: UpdateAllQuestionsVisibility;
  private toggleQuestionLock: ToggleQuestionLock;

  constructor(questionRepository: IQuestionRepository, answerRepository: IAnswerRepository) {
    this.createQuestion = new CreateQuestion(questionRepository);
    this.listQuestions = new ListQuestions(questionRepository, answerRepository);
    this.getQuestionById = new GetQuestionById(questionRepository, answerRepository);
    this.getQuestionByCode = new GetQuestionByCode(questionRepository, answerRepository);
    this.updateQuestion = new UpdateQuestion(questionRepository);
    this.deleteQuestion = new DeleteQuestion(questionRepository);
    this.updateQuestionVisibility = new UpdateQuestionVisibility(questionRepository);
    this.updateAllQuestionsVisibility = new UpdateAllQuestionsVisibility(questionRepository);
    this.toggleQuestionLock = new ToggleQuestionLock(questionRepository);
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

  async getByCode(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      const userId = req.user!.userId;
      const isAdmin = req.user!.role === 'admin';

      const result = await this.getQuestionByCode.execute(code, userId, isAdmin);

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

  async updateVisibility(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { visible } = req.body;

      if (typeof visible !== 'boolean') {
        res.status(400).json({ error: 'visible must be a boolean' });
        return;
      }

      await this.updateQuestionVisibility.execute(id, visible);

      res.status(200).json({ success: true, message: 'Visibility updated successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateAllVisibility(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { visible } = req.body;

      if (typeof visible !== 'boolean') {
        res.status(400).json({ error: 'visible must be a boolean' });
        return;
      }

      const result = await this.updateAllQuestionsVisibility.execute(visible);

      res.status(200).json({ 
        success: true, 
        message: `${result.updated} questions visibility updated successfully`,
        updated: result.updated
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async toggleLock(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isLocked } = req.body;

      if (typeof isLocked !== 'boolean') {
        res.status(400).json({ error: 'isLocked must be a boolean' });
        return;
      }

      await this.toggleQuestionLock.execute(id, isLocked);

      res.status(200).json({ 
        success: true, 
        message: `Question ${isLocked ? 'locked' : 'unlocked'} successfully`
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
