import { Router } from 'express';
import express from 'express';
import { body, validationResult } from 'express-validator';
import { UserModel } from '../models/user';
import { authMiddleware, AuthRequest, generateToken } from '../middleware/auth';
import { db } from '../models/db';
import { randomUUID } from 'crypto';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - 認證
 *     summary: 註冊新使用者
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: 註冊成功
 *       400:
 *         description: 請求錯誤
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    try {
      const existingUser = db.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const passwordHash = await UserModel.hashPassword(password);
      
      const user = db.createUser({
        id: randomUUID(),
        email,
        passwordHash,
        name,
        createdAt: new Date(),
      });

      const token = generateToken(user.id, user.email);

      res.status(201).json({
        token,
        user: UserModel.sanitize(user),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - 認證
 *     summary: 使用者登入
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               rememberMe:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 登入成功
 *       401:
 *         description: 認證失敗
 */
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, rememberMe } = req.body;

    try {
      const user = db.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValid = await UserModel.comparePassword(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const expiresIn = rememberMe ? '7d' : '1h';
      const token = generateToken(user.id, user.email, expiresIn);

      res.json({
        token,
        user: UserModel.sanitize(user),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - 認證
 *     summary: 取得當前使用者資訊
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 *       401:
 *         description: 未授權
 */
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    
    const user = db.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(UserModel.sanitize(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
