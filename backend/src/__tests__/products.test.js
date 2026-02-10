const request = require('supertest');
const app = require('../index');
const jwt = require('jsonwebtoken');

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sellerToken = jwt.sign({ id: 'seller1', role: 'SELLER' }, process.env.JWT_SECRET || 'test-secret');

describe('GET /api/products', () => {
  it('returns paginated products', async () => {
    prisma.product.findMany.mockResolvedValue([{ id: 'p1', name: 'Shoes' }]);
    prisma.product.count.mockResolvedValue(1);

    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(1);
    expect(res.body.total).toBe(1);
  });
});

describe('POST /api/products', () => {
  it('creates product when authenticated as seller', async () => {
    prisma.product.create.mockResolvedValue({ id: 'p2', name: 'Bag' });
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ name: 'Bag', description: 'Nice bag', price: 49.99, stock: 10, images: [], categoryId: 'cat1' });
    expect(res.status).toBe(201);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/products').send({ name: 'Bag' });
    expect(res.status).toBe(401);
  });
});
