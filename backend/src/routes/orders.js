const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middleware/auth');

const prisma = new PrismaClient();

router.use(verifyToken);

router.get('/', async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' });

    const total = cartItems.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        shippingAddress,
        paymentMethod,
        items: {
          create: cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.product.price })),
        },
      },
      include: { items: true },
    });
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.status(201).json(order);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } },
    });
    if (!order || order.userId !== req.user.id) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  } catch (e) { next(e); }
});

module.exports = router;
