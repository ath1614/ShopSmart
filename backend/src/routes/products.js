const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { verifyToken, requireRole } = require('../middleware/auth');

const prisma = new PrismaClient();

router.get('/', async (req, res, next) => {
  try {
    const { search, categoryId, page = 1, limit = 20 } = req.query;
    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(categoryId && { categoryId }),
    };
    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip: (page - 1) * limit, take: +limit, include: { category: true } }),
      prisma.product.count({ where }),
    ]);
    res.json({ products, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true, reviews: { include: { user: { select: { name: true, avatar: true } } } } },
    });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (e) { next(e); }
});

router.post('/', verifyToken, requireRole('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const { name, description, price, stock, images, categoryId } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, stock, images, categoryId, sellerId: req.user.id },
    });
    res.status(201).json(product);
  } catch (e) { next(e); }
});

router.put('/:id', verifyToken, requireRole('SELLER', 'ADMIN'), async (req, res, next) => {
  try {
    const product = await prisma.product.update({ where: { id: req.params.id }, data: req.body });
    res.json(product);
  } catch (e) { next(e); }
});

router.delete('/:id', verifyToken, requireRole('ADMIN'), async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
