import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import aiRoutes from '../routes/ai.js';
import jwt from 'jsonwebtoken';


jest.mock('../controllers/aiController.js', () => ({
  suggestTime: jest.fn((req, res) => {
    const { deliveryType } = req.body;
    
    if (!deliveryType) {
      return res.status(400).json({ error: "Delivery type is required" });
    }

    const now = new Date();
    const suggested = new Date(now);
    suggested.setMinutes(suggested.getMinutes() + 30);
    suggested.setSeconds(0);
    suggested.setMilliseconds(0);
    
    if (suggested <= now) {
      suggested.setHours(suggested.getHours() + 1);
      suggested.setMinutes(0);
    }

    res.json({
      suggestedTime: suggested.toISOString().slice(0, 16),
      aiPowered: false,
    });
  }),
}));

const app = express();
app.use(express.json());
app.use('/ai', aiRoutes);

describe('AI Time Suggestion Tests', () => {
  let validToken;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    validToken = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1d' });
  });

  describe('POST /ai/suggest-time', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(app)
        .post('/ai/suggest-time')
        .send({ deliveryType: 'IN_STORE' });
      
      expect(res.status).toBe(401);
    });

    it('should return 400 if delivery type is missing', async () => {
      const res = await request(app)
        .post('/ai/suggest-time')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Delivery type is required');
    });

    it('should return suggested time for IN_STORE delivery', async () => {
      const res = await request(app)
        .post('/ai/suggest-time')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ 
          deliveryType: 'IN_STORE',
          currentTime: new Date().toISOString()
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('suggestedTime');
      expect(res.body).toHaveProperty('aiPowered');
      expect(res.body.suggestedTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });

    it('should return suggested time for DELIVERY', async () => {
      const res = await request(app)
        .post('/ai/suggest-time')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ 
          deliveryType: 'DELIVERY',
          currentTime: new Date().toISOString()
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('suggestedTime');
      expect(res.body.suggestedTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });

    it('should return suggested time for CURBSIDE', async () => {
      const res = await request(app)
        .post('/ai/suggest-time')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ 
          deliveryType: 'CURBSIDE',
          currentTime: new Date().toISOString()
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('suggestedTime');
      expect(res.body.suggestedTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });

    it('should return 403 if token is invalid', async () => {
      const res = await request(app)
        .post('/ai/suggest-time')
        .set('Authorization', 'Bearer invalid-token')
        .send({ deliveryType: 'IN_STORE' });
      
      expect(res.status).toBe(403);
    });
  });
});

