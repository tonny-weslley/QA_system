import { Router } from 'express';
import { ConfigController } from '../controllers/ConfigController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

export const createConfigRoutes = (
  configController: ConfigController
): Router => {
  const router = Router();

  /**
   * @swagger
   * /api/config:
   *   get:
   *     summary: Get all configurations
   *     tags: [Config]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Configurations retrieved successfully
   */
  router.get('/', authMiddleware, (req, res) => configController.getAll(req, res));

  /**
   * @swagger
   * /api/config/{key}:
   *   get:
   *     summary: Get configuration by key
   *     tags: [Config]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: key
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Configuration retrieved successfully
   */
  router.get('/:key', authMiddleware, (req, res) => configController.get(req, res));

  /**
   * @swagger
   * /api/config/{key}:
   *   put:
   *     summary: Update configuration
   *     tags: [Config]
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
  router.put('/:key', authMiddleware, adminMiddleware, (req, res) =>
    configController.update(req, res)
  );

  return router;
};
