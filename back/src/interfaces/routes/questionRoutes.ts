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
 * /api/questions/code/{code}:
 *   get:
 *     tags: [Questions]
 *     summary: Get question by code
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[A-Za-z0-9]{5}$'
 *         description: 5-character alphanumeric code
 *     responses:
 *       200:
 *         description: Question details
 *       404:
 *         description: Question not found
 */
router.get('/code/:code', authMiddleware, (req, res) => getQuestionController().getByCode(req, res));

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

/**
 * @swagger
 * /api/questions/{id}/visibility:
 *   patch:
 *     tags: [Questions]
 *     summary: Update question visibility (Admin only)
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
 *             required:
 *               - visible
 *             properties:
 *               visible:
 *                 type: boolean
 *                 description: Whether the question should be visible to participants
 *     responses:
 *       200:
 *         description: Visibility updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Question not found
 */
router.patch('/:id/visibility', authMiddleware, adminMiddleware, (req, res) =>
  getQuestionController().updateVisibility(req, res)
);

/**
 * @swagger
 * /api/questions/visibility/all:
 *   patch:
 *     tags: [Questions]
 *     summary: Update visibility for all questions (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visible
 *             properties:
 *               visible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: All questions visibility updated successfully
 *       400:
 *         description: Invalid request
 */
router.patch('/visibility/all', authMiddleware, adminMiddleware, (req, res) =>
  getQuestionController().updateAllVisibility(req, res)
);

/**
 * @swagger
 * /api/questions/{id}/lock:
 *   patch:
 *     tags: [Questions]
 *     summary: Toggle question lock status (Admin only)
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
 *             required:
 *               - isLocked
 *             properties:
 *               isLocked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Question lock status updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Question not found
 */
router.patch('/:id/lock', authMiddleware, adminMiddleware, (req, res) =>
  getQuestionController().toggleLock(req, res)
);

export default router;
