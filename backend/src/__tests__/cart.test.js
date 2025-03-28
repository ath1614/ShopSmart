const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    cartItem: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const token = jwt.sign({ id: 'user1', role: 'SHOPPER' }, process.env.JWT_SECRET || 'test-secret');

describe('GET /api/cart', () => {
  it('returns cart items for authenticated user', async () => {
    prisma.cartItem.findMany.mockResolvedValue([
      { id: 'c1', productId: 'p1', quantity: 2, product: { name: 'Shoes', price: 99.99 } },
    ]);
    const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/cart', () => {
  it('adds item to cart', async () => {
    prisma.cartItem.findFirst.mockResolvedValue(null);
    prisma.cartItem.create.mockResolvedValue({ id: 'c2', productId: 'p2', quantity: 1 });
    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'p2', quantity: 1 });
    expect(res.status).toBe(201);
  });

  it('increments quantity if item already in cart', async () => {
    prisma.cartItem.findFirst.mockResolvedValue({ id: 'c1', quantity: 1 });
    prisma.cartItem.update.mockResolvedValue({ id: 'c1', quantity: 2 });
    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'p1', quantity: 1 });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(2);
  });
});
