import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../src/app';

describe('Cart API Integration Tests', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp();
  });

  describe('POST /cart', () => {
    it('should create a new cart', async () => {
      const response = await request(app)
        .post('/cart')
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('contextId');
      expect(response.body.items).toEqual([]);
      expect(response.body.total).toBe(0);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('expiresAt');
    });
  });

  describe('POST /cart/:id/item', () => {
    it('should add item to cart', async () => {
      // Create cart first
      const createResponse = await request(app)
        .post('/cart')
        .expect(201);

      const cartId = createResponse.body.id;

      // Add item
      const addResponse = await request(app)
        .post(`/cart/${cartId}/item`)
        .send({
          id: 'item-1',
          productId: 'prod-1',
          name: 'iPhone 15',
          type: 'phone',
          price: 999.99,
          quantity: 1,
        })
        .expect(200);

      expect(addResponse.body.items).toHaveLength(1);
      expect(addResponse.body.items[0]).toMatchObject({
        id: 'item-1',
        productId: 'prod-1',
        name: 'iPhone 15',
        type: 'phone',
        price: 999.99,
        quantity: 1,
      });
      expect(addResponse.body.total).toBe(999.99);
    });

    it('should return 400 for missing fields', async () => {
      const createResponse = await request(app)
        .post('/cart')
        .expect(201);

      const cartId = createResponse.body.id;

      await request(app)
        .post(`/cart/${cartId}/item`)
        .send({
          id: 'item-1',
          // missing other fields
        })
        .expect(400);
    });

    it('should return 404 for non-existent cart', async () => {
      await request(app)
        .post('/cart/non-existent/item')
        .send({
          id: 'item-1',
          productId: 'prod-1',
          name: 'Test',
          type: 'phone',
          price: 10,
          quantity: 1,
        })
        .expect(404);
    });

    it('should return 400 for duplicate item ID', async () => {
      const createResponse = await request(app)
        .post('/cart')
        .expect(201);

      const cartId = createResponse.body.id;
      const item = {
        id: 'item-1',
        productId: 'prod-1',
        name: 'Test',
        type: 'phone',
        price: 10,
        quantity: 1,
      };

      await request(app)
        .post(`/cart/${cartId}/item`)
        .send(item)
        .expect(200);

      await request(app)
        .post(`/cart/${cartId}/item`)
        .send(item)
        .expect(400);
    });
  });

  describe('DELETE /cart/:id/item', () => {
    it('should remove item from cart', async () => {
      // Create cart
      const createResponse = await request(app)
        .post('/cart')
        .expect(201);

      const cartId = createResponse.body.id;

      // Add item
      await request(app)
        .post(`/cart/${cartId}/item`)
        .send({
          id: 'item-1',
          productId: 'prod-1',
          name: 'Test',
          type: 'phone',
          price: 10,
          quantity: 1,
        })
        .expect(200);

      // Remove item
      const removeResponse = await request(app)
        .delete(`/cart/${cartId}/item`)
        .send({ itemId: 'item-1' })
        .expect(200);

      expect(removeResponse.body.items).toHaveLength(0);
      expect(removeResponse.body.total).toBe(0);
    });

    it('should return 400 for missing itemId', async () => {
      const createResponse = await request(app)
        .post('/cart')
        .expect(201);

      const cartId = createResponse.body.id;

      await request(app)
        .delete(`/cart/${cartId}/item`)
        .send({})
        .expect(400);
    });

    it('should return 404 for non-existent cart', async () => {
      await request(app)
        .delete('/cart/non-existent/item')
        .send({ itemId: 'item-1' })
        .expect(404);
    });

    it('should return 400 for non-existent item', async () => {
      const createResponse = await request(app)
        .post('/cart')
        .expect(201);

      const cartId = createResponse.body.id;

      await request(app)
        .delete(`/cart/${cartId}/item`)
        .send({ itemId: 'non-existent' })
        .expect(400);
    });
  });

  describe('GET /cart/:id', () => {
    it('should retrieve cart', async () => {
      // Create cart
      const createResponse = await request(app)
        .post('/cart')
        .expect(201);

      const cartId = createResponse.body.id;

      // Get cart
      const getResponse = await request(app)
        .get(`/cart/${cartId}`)
        .expect(200);

      expect(getResponse.body.id).toBe(cartId);
      expect(getResponse.body.items).toEqual([]);
    });

    it('should return 404 for non-existent cart', async () => {
      await request(app)
        .get('/cart/non-existent')
        .expect(404);
    });
  });

  describe('GET /cart/:id/total', () => {
    it('should calculate cart total', async () => {
      // Create cart
      const createResponse = await request(app)
        .post('/cart')
        .expect(201);

      const cartId = createResponse.body.id;

      // Add items
      await request(app)
        .post(`/cart/${cartId}/item`)
        .send({
          id: 'item-1',
          productId: 'prod-1',
          name: 'Item 1',
          type: 'accessory',
          price: 10,
          quantity: 2,
        });

      await request(app)
        .post(`/cart/${cartId}/item`)
        .send({
          id: 'item-2',
          productId: 'prod-2',
          name: 'Item 2',
          type: 'phone',
          price: 100,
          quantity: 1,
        });

      // Get total
      const totalResponse = await request(app)
        .get(`/cart/${cartId}/total`)
        .expect(200);

      expect(totalResponse.body.cartId).toBe(cartId);
      expect(totalResponse.body.total).toBe(120);
    });

    it('should return 0 for empty cart', async () => {
      const createResponse = await request(app)
        .post('/cart')
        .expect(201);

      const cartId = createResponse.body.id;

      const totalResponse = await request(app)
        .get(`/cart/${cartId}/total`)
        .expect(200);

      expect(totalResponse.body.total).toBe(0);
    });

    it('should return 404 for non-existent cart', async () => {
      await request(app)
        .get('/cart/non-existent/total')
        .expect(404);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('Full cart workflow', () => {
    it('should handle complete cart lifecycle', async () => {
      // 1. Create cart
      const createResponse = await request(app)
        .post('/cart')
        .expect(201);

      const cartId = createResponse.body.id;

      // 2. Add multiple items
      await request(app)
        .post(`/cart/${cartId}/item`)
        .send({
          id: 'phone-1',
          productId: 'prod-phone',
          name: 'iPhone 15',
          type: 'phone',
          price: 999.99,
          quantity: 1,
        })
        .expect(200);

      await request(app)
        .post(`/cart/${cartId}/item`)
        .send({
          id: 'plan-1',
          productId: 'prod-plan',
          name: '5G Unlimited Plan',
          type: 'plan',
          price: 75,
          quantity: 1,
        })
        .expect(200);

      await request(app)
        .post(`/cart/${cartId}/item`)
        .send({
          id: 'accessory-1',
          productId: 'prod-case',
          name: 'Phone Case',
          type: 'accessory',
          price: 29.99,
          quantity: 2,
        })
        .expect(200);

      // 3. Get cart and verify
      const cartResponse = await request(app)
        .get(`/cart/${cartId}`)
        .expect(200);

      expect(cartResponse.body.items).toHaveLength(3);
      expect(cartResponse.body.total).toBeCloseTo(1134.97, 2);

      // 4. Remove an item
      await request(app)
        .delete(`/cart/${cartId}/item`)
        .send({ itemId: 'accessory-1' })
        .expect(200);

      // 5. Verify total updated
      const totalResponse = await request(app)
        .get(`/cart/${cartId}/total`)
        .expect(200);

      expect(totalResponse.body.total).toBeCloseTo(1074.99, 2);
    });
  });
});
