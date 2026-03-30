const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    cartItem: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const token = jwt.sign({ id: 'user1', role: 'SHOPPER' }, process.env.JWT_SECRET || 'test-secret');

describe('GET /api/orders', () => {
  it('returns orders for authenticated user', async () => {
    prisma.order.findMany.mockResolvedValue([
      { id: 'o1', total: 199.99, status: 'PENDING', items: [] },
    ]);
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe('POST /api/orders', () => {
  it('returns 400 when cart is empty', async () => {
    prisma.cartItem.findMany.mockResolvedValue([]);
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: {}, paymentMethod: 'card' });
    expect(res.status).toBe(400);
  });

  it('creates order from cart items', async () => {
    prisma.cartItem.findMany.mockResolvedValue([
      { productId: 'p1', quantity: 2, product: { price: 50 } },
    ]);
    prisma.order.create.mockResolvedValue({ id: 'o2', total: 100, status: 'PENDING', items: [] });
    prisma.cartItem.deleteMany.mockResolvedValue({});
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: { street: '123 Main' }, paymentMethod: 'card' });
    expect(res.status).toBe(201);
    expect(res.body.total).toBe(100);
  });
});
