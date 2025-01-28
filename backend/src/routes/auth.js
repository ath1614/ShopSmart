const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Local register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, name, passwordHash } });
    res.status(201).json({ token: signToken(user), user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) { next(e); }
});

// Local login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: signToken(user), user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) { next(e); }
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => res.redirect(`${process.env.CLIENT_URL}/oauth?token=${signToken(req.user)}`));

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  (req, res) => res.redirect(`${process.env.CLIENT_URL}/oauth?token=${signToken(req.user)}`));

module.exports = router;
