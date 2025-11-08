import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.js';
import { authenticateToken } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Tests', () => {
  describe('POST /auth/login', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ password: 'password123' });
      
      expect(res.status).toBe(400);
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com' });
      
      expect(res.status).toBe(400);
    });

    it('should return 400 if email format is invalid', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'invalid-email', password: 'password123' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid email format');
    });

    it('should return 400 if password is too short', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: '12345' });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('at least 6 characters');
    });
  });
});

describe('Auth Guard Tests', () => {
  describe('authenticateToken middleware', () => {
    it('should return 401 if no token provided', () => {
      const req = {
        headers: {}
      };
      const res = {
        sendStatus: jest.fn()
      };
      const next = jest.fn();

      authenticateToken(req, res, next);
      expect(res.sendStatus).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', (done) => {
      const req = {
        headers: {
          authorization: 'Bearer invalid-token'
        }
      };
      const res = {
        sendStatus: jest.fn()
      };
      const next = jest.fn();

      process.env.JWT_SECRET = 'test-secret';
      authenticateToken(req, res, next);
      
    
      setTimeout(() => {
        expect(res.sendStatus).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should call next if token is valid', (done) => {
      process.env.JWT_SECRET = 'test-secret';
      const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1d' });
      const req = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };
      const res = {};
      const next = jest.fn();

      authenticateToken(req, res, next);
      
      setTimeout(() => {
        expect(next).toHaveBeenCalled();
        expect(req.user).toBeDefined();
        done();
      }, 100);
    });
  });
});

