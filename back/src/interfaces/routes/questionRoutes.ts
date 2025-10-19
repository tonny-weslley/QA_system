import { Router } from 'express';
import { QuestionController } from '../controllers/QuestionController';
import { QuestionRepository } from '../../infra/database/repositories/QuestionRepository';
import { AnswerRepository } from '../../infra/database/repositories/AnswerRepository';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Lazy initialization - repositories are created on first request
let questionController: QuestionController;

const getQuestionController = (): QuestionController => {
  if (!questionController) {
    const questionRepository = new QuestionRepository();
    const answerRepository = new AnswerRepository();
    questionController = new QuestionController(questionRepository, answerRepository);
  }
  return questionController;
};

/**
 * @swagger
 * /api/questions:
 *   post:
 *     tags: [Questions]
 *     summary: Create a new question (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statement
 *               - options
 *               - difficulty
 *             properties:
 *               statement:
 *                 type: string
 *               options:
 *                 type: array
 *                 minItems: 2
 *                 maxItems: 5
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     isCorrect:
 *                       type: boolean
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admin access required
 */
router.post('/', authMiddleware, adminMiddleware, (req, res) =>
  getQuestionController().create(req, res)
);

/**
 * @swagger
 * /api/questions:
 *   get:
 *     tags: [Questions]
 *     summary: List questions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of questions
 */
router.get('/', authMiddleware, (req, res) => getQuestionController().list(req, res));

/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     tags: [Questions]
 *     summary: Get question by ID
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
 *         description: Question details
 *       404:
 *         description: Question not found
 */
router.get('/:id', authMiddleware, (req, res) => getQuestionController().getById(req, res));

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     tags: [Questions]
 *     summary: Update question (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statement:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     isCorrect:
 *                       type: boolean
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admin access required
 */
router.put('/:id', authMiddleware, adminMiddleware, (req, res) =>
  getQuestionController().update(req, res)
);

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     tags: [Questions]
 *     summary: Delete question (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Question deleted successfully
 *       404:
 *         description: Question not found
 *       403:
 *         description: Admin access required
 */
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) =>
  getQuestionController().delete(req, res)
);

export default router;
