import { Router } from 'express';
import { ScoreController } from '../controllers/ScoreController';
import { ScoreRepository } from '../../infra/database/repositories/ScoreRepository';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Lazy initialization
let scoreController: ScoreController;

const getScoreController = (): ScoreController => {
  if (!scoreController) {
    const scoreRepository = new ScoreRepository();
    scoreController = new ScoreController(scoreRepository);
  }
  return scoreController;
};

/**
 * @swagger
 * /api/scores:
 *   get:
 *     tags: [Scores]
 *     summary: Get scoreboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scoreboard with rankings
 */
router.get('/', authMiddleware, (req, res) => getScoreController().scoreboard(req, res));

/**
 * @swagger
 * /api/scores/me:
 *   get:
 *     tags: [Scores]
 *     summary: Get my score
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User score details
 */
router.get('/me', authMiddleware, (req, res) => getScoreController().myScore(req, res));

export default router;
