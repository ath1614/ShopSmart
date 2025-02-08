const request = require('supertest');
const app = require('../index');

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('POST /api/auth/register', () => {
  it('creates a new user and returns token', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'user1', email: 'test@test.com', name: 'Test', role: 'SHOPPER',
    });

    const res = await request(app).post('/api/auth/register').send({
      email: 'test@test.com', password: 'password123', name: 'Test',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@test.com');
  });

  it('returns 409 if email already exists', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'existing' });
    const res = await request(app).post('/api/auth/register').send({
      email: 'existing@test.com', password: 'password123',
    });
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  it('returns 401 for invalid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/login').send({
      email: 'none@test.com', password: 'wrong',
    });
    expect(res.status).toBe(401);
  });
});
