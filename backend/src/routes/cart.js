const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middleware/auth');

const prisma = new PrismaClient();

router.use(verifyToken);

router.get('/', async (req, res, next) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const existing = await prisma.cartItem.findFirst({ where: { userId: req.user.id, productId } });
    if (existing) {
      const item = await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } });
      return res.json(item);
    }
    const item = await prisma.cartItem.create({ data: { userId: req.user.id, productId, quantity } });
    res.status(201).json(item);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const item = await prisma.cartItem.update({ where: { id: req.params.id }, data: { quantity: req.body.quantity } });
    res.json(item);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
