import request from 'supertest';

// Mock Scalar to avoid ESM issues in Jest
jest.mock('@scalar/express-api-reference', () => ({
  apiReference: () => (req: any, res: any) => res.send('API Docs'),
}));

import app from '../src/index';
import { db } from '../src/models/db';

describe('API Integration Tests', () => {
  beforeEach(() => {
    // 清除資料庫
    db.clear();
  });

  describe('Auth API', () => {
    describe('POST /api/auth/register', () => {
      it('should register a new user', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
          });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', 'test@example.com');
        expect(res.body.user).toHaveProperty('name', 'Test User');
        expect(res.body.user).not.toHaveProperty('passwordHash');
      });

      it('should reject duplicate email', async () => {
        await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
          });

        const res = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password456',
            name: 'Another User',
          });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Email already exists');
      });

      it('should reject invalid email', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'invalid-email',
            password: 'password123',
            name: 'Test User',
          });

        expect(res.status).toBe(400);
      });

      it('should reject short password', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'short',
            name: 'Test User',
          });

        expect(res.status).toBe(400);
      });
    });

    describe('POST /api/auth/login', () => {
      beforeEach(async () => {
        await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
          });
      });

      it('should login with correct credentials', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'password123',
          });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', 'test@example.com');
      });

      it('should reject wrong password', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword',
          });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'Invalid credentials');
      });

      it('should reject non-existent user', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: 'password123',
          });

        expect(res.status).toBe(401);
      });
    });

    describe('GET /api/auth/me', () => {
      let token: string;

      beforeEach(async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
          });
        token = res.body.token;
      });

      it('should return current user with valid token', async () => {
        const res = await request(app)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('email', 'test@example.com');
      });

      it('should reject without token', async () => {
        const res = await request(app).get('/api/auth/me');

        expect(res.status).toBe(401);
      });

      it('should reject with invalid token', async () => {
        const res = await request(app)
          .get('/api/auth/me')
          .set('Authorization', 'Bearer invalid-token');

        expect(res.status).toBe(401);
      });
    });
  });

  describe('Calculator API', () => {
    let token: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });
      token = res.body.token;
    });

    describe('POST /api/calculator/calculate', () => {
      it('should calculate expression', async () => {
        const res = await request(app)
          .post('/api/calculator/calculate')
          .set('Authorization', `Bearer ${token}`)
          .send({ expression: '2 + 3' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('result', 5);
        expect(res.body).toHaveProperty('expression', '2 + 3');
      });

      it('should reject invalid expression', async () => {
        const res = await request(app)
          .post('/api/calculator/calculate')
          .set('Authorization', `Bearer ${token}`)
          .send({ expression: '2 + abc' });

        expect(res.status).toBe(400);
      });

      it('should require authentication', async () => {
        const res = await request(app)
          .post('/api/calculator/calculate')
          .send({ expression: '2 + 3' });

        expect(res.status).toBe(401);
      });
    });

    describe('GET /api/calculator/history', () => {
      beforeEach(async () => {
        await request(app)
          .post('/api/calculator/calculate')
          .set('Authorization', `Bearer ${token}`)
          .send({ expression: '2 + 3' });
        
        await request(app)
          .post('/api/calculator/calculate')
          .set('Authorization', `Bearer ${token}`)
          .send({ expression: '5 * 4' });
      });

      it('should return calculation history', async () => {
        const res = await request(app)
          .get('/api/calculator/history')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.history).toHaveLength(2);
        expect(res.body.history[0]).toHaveProperty('expression');
        expect(res.body.history[0]).toHaveProperty('result');
      });

      it('should limit history results', async () => {
        const res = await request(app)
          .get('/api/calculator/history?limit=1')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.history).toHaveLength(1);
      });
    });

    describe('DELETE /api/calculator/history', () => {
      beforeEach(async () => {
        await request(app)
          .post('/api/calculator/calculate')
          .set('Authorization', `Bearer ${token}`)
          .send({ expression: '2 + 3' });
      });

      it('should clear history', async () => {
        const res = await request(app)
          .delete('/api/calculator/history')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(204);

        const historyRes = await request(app)
          .get('/api/calculator/history')
          .set('Authorization', `Bearer ${token}`);

        expect(historyRes.body.history).toHaveLength(0);
      });
    });
  });
});
