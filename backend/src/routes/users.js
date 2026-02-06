const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middleware/auth');

const prisma = new PrismaClient();

router.use(verifyToken);

router.get('/me', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true },
    });
    res.json(user);
  } catch (e) { next(e); }
});

router.put('/me', async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, avatar },
      select: { id: true, email: true, name: true, role: true, avatar: true },
    });
    res.json(user);
  } catch (e) { next(e); }
});

module.exports = router;
