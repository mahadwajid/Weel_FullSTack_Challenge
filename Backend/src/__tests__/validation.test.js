import { describe, it, expect } from '@jest/globals';
import { validateLogin, validateOrder } from '../middleware/validation.js';

describe('Validation Middleware Tests', () => {
  describe('validateLogin', () => {
    it('should return 400 if email is missing', () => {
      const req = {
        body: { password: 'password123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateLogin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email and password are required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if password is missing', () => {
      const req = {
        body: { email: 'test@example.com' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateLogin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if email format is invalid', () => {
      const req = {
        body: { email: 'invalid-email', password: 'password123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateLogin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if password is too short', () => {
      const req = {
        body: { email: 'test@example.com', password: '12345' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateLogin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Password must be at least 6 characters' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if validation passes', () => {
      const req = {
        body: { email: 'test@example.com', password: 'password123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateLogin(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('validateOrder', () => {
    it('should return 400 if deliveryType is missing', () => {
      const req = {
        body: {}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateOrder(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Delivery type is required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if deliveryType is invalid', () => {
      const req = {
        body: { deliveryType: 'INVALID_TYPE' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateOrder(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid delivery type' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if DELIVERY type missing phone', () => {
      const req = {
        body: { deliveryType: 'DELIVERY' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateOrder(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Phone is required for this delivery type' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if DELIVERY type missing address', () => {
      const req = {
        body: { deliveryType: 'DELIVERY', phone: '1234567890' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateOrder(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Address is required for delivery' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if phone is too short', () => {
      const req = {
        body: { deliveryType: 'CURBSIDE', phone: '123' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateOrder(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid phone number' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if pickupDatetime is in the past', () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60).toISOString();
      const req = {
        body: { 
          deliveryType: 'IN_STORE',
          pickupDatetime: pastDate
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateOrder(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Pickup time must be in the future' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if validation passes', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60).toISOString();
      const req = {
        body: { 
          deliveryType: 'DELIVERY',
          phone: '1234567890',
          address: '123 Main St',
          pickupDatetime: futureDate
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      validateOrder(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});

