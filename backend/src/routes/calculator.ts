import { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { evaluateExpression } from '../utils/calculator';
import { db } from '../models/db';
import { randomUUID } from 'crypto';

const router = Router();

// 所有計算機路由都需要認證
router.use(authMiddleware);

/**
 * @openapi
 * /api/calculator/calculate:
 *   post:
 *     tags:
 *       - 計算機
 *     summary: 執行計算
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expression
 *             properties:
 *               expression:
 *                 type: string
 *                 example: "2 + 2"
 *     responses:
 *       200:
 *         description: 計算成功
 *       400:
 *         description: 無效的表達式
 *       401:
 *         description: 未授權
 */
router.post(
  '/calculate',
  [body('expression').notEmpty().withMessage('Expression is required')],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { expression } = req.body;
    const userId = req.user!.userId;

    try {
      const result = evaluateExpression(expression);

      const calculation = db.createCalculation({
        id: randomUUID(),
        userId,
        expression,
        result,
        createdAt: new Date(),
      });

      res.json(calculation);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Invalid expression' });
    }
  }
);

/**
 * @openapi
 * /api/calculator/history:
 *   get:
 *     tags:
 *       - 計算機
 *     summary: 取得計算歷史記錄
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: 成功
 *       401:
 *         description: 未授權
 *   delete:
 *     tags:
 *       - 計算機
 *     summary: 清除計算歷史記錄
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功清除
 *       401:
 *         description: 未授權
 */
router.get(
  '/history',
  [query('limit').optional().isInt({ min: 1, max: 100 })],
  async (req: AuthRequest, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.user!.userId;

    try {
      const history = db.findCalculationsByUserId(userId, limit);
      res.json({ history });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// 清除歷史
router.delete('/history', async (req: AuthRequest, res) => {
  const userId = req.user!.userId;

  try {
    db.deleteCalculationsByUserId(userId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
