import { Router } from 'express';
import { AnswerController } from '../controllers/AnswerController';
import { AnswerRepository } from '../../infra/database/repositories/AnswerRepository';
import { QuestionRepository } from '../../infra/database/repositories/QuestionRepository';
import { ScoreRepository } from '../../infra/database/repositories/ScoreRepository';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Lazy initialization
let answerController: AnswerController;

const getAnswerController = (): AnswerController => {
  if (!answerController) {
    const answerRepository = new AnswerRepository();
    const questionRepository = new QuestionRepository();
    const scoreRepository = new ScoreRepository();
    answerController = new AnswerController(answerRepository, questionRepository, scoreRepository);
  }
  return answerController;
};

/**
 * @swagger
 * /api/answers:
 *   post:
 *     tags: [Answers]
 *     summary: Submit an answer to a question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - selectedOptionId
 *             properties:
 *               questionId:
 *                 type: string
 *               selectedOptionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Answer submitted successfully
 *       400:
 *         description: Validation error or question already answered
 */
router.post('/', authMiddleware, (req, res) => getAnswerController().submit(req, res));

/**
 * @swagger
 * /api/answers/me:
 *   get:
 *     tags: [Answers]
 *     summary: Get my answers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user answers
 */
router.get('/me', authMiddleware, (req, res) => getAnswerController().getMyAnswers(req, res));

/**
 * @swagger
 * /api/answers/question/{id}:
 *   get:
 *     tags: [Answers]
 *     summary: Get answers for a specific question (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question answer statistics
 *       403:
 *         description: Admin access required
 */
router.get('/question/:id', authMiddleware, adminMiddleware, (req, res) =>
  getAnswerController().getQuestionAnswersHandler(req, res)
);

export default router;
