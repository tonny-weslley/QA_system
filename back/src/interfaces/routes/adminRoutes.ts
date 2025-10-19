import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { ConfigController } from '../controllers/ConfigController';
import { QuestionRepository } from '../../infra/database/repositories/QuestionRepository';
import { AnswerRepository } from '../../infra/database/repositories/AnswerRepository';
import { ScoreRepository } from '../../infra/database/repositories/ScoreRepository';
import { UserRepository } from '../../infra/database/repositories/UserRepository';
import { ConfigRepository } from '../../infrastructure/database/repositories/ConfigRepository';
import { DatabaseConfig } from '../../config/database';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Lazy initialization
let adminController: AdminController;
let configController: ConfigController;

const getAdminController = (): AdminController => {
  if (!adminController) {
    const questionRepository = new QuestionRepository();
    const answerRepository = new AnswerRepository();
    const scoreRepository = new ScoreRepository();
    const userRepository = new UserRepository();
    adminController = new AdminController(
      questionRepository,
      answerRepository,
      scoreRepository,
      userRepository
    );
  }
  return adminController;
};

const getConfigController = (): ConfigController => {
  if (!configController) {
    const db = DatabaseConfig.getDb();
    const configRepository = new ConfigRepository(db);
    configController = new ConfigController(configRepository);
  }
  return configController;
};

/**
 * @swagger
 * /api/admin/reset-questions:
 *   post:
 *     tags: [Admin]
 *     summary: Unlock all questions (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Questions unlocked successfully
 *       403:
 *         description: Admin access required
 */
router.post('/reset-questions', authMiddleware, adminMiddleware, (req, res) =>
  getAdminController().resetQuestionsHandler(req, res)
);

/**
 * @swagger
 * /api/admin/reset-scores:
 *   post:
 *     tags: [Admin]
 *     summary: Reset all scores (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scores reset successfully
 *       403:
 *         description: Admin access required
 */
router.post('/reset-scores', authMiddleware, adminMiddleware, (req, res) =>
  getAdminController().resetScoresHandler(req, res)
);

/**
 * @swagger
 * /api/admin/finalize-event:
 *   post:
 *     tags: [Admin]
 *     summary: Finalize event and lock all questions (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Event finalized successfully
 *       403:
 *         description: Admin access required
 */
router.post('/finalize-event', authMiddleware, adminMiddleware, (req, res) =>
  getAdminController().finalizeEventHandler(req, res)
);

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard statistics (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       403:
 *         description: Admin access required
 */
router.get('/dashboard', authMiddleware, adminMiddleware, (req, res) =>
  getAdminController().dashboardHandler(req, res)
);

/**
 * @swagger
 * /api/admin/config:
 *   get:
 *     tags: [Admin]
 *     summary: Get all configurations (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configurations retrieved successfully
 */
router.get('/config', authMiddleware, adminMiddleware, (req, res) =>
  getConfigController().getAll(req, res)
);

/**
 * @swagger
 * /api/admin/config/{key}:
 *   put:
 *     tags: [Admin]
 *     summary: Update configuration (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
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
 *               value:
 *                 type: [boolean, string, number]
 *     responses:
 *       200:
 *         description: Configuration updated successfully
 */
router.put('/config/:key', authMiddleware, adminMiddleware, (req, res) =>
  getConfigController().update(req, res)
);

export default router;
