const passport = require('passport');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const upsertOAuthUser = async (provider, profile) => {
  const email = profile.emails?.[0]?.value;
  return prisma.user.upsert({
    where: { email },
    update: { oauthProvider: provider, oauthId: profile.id, avatar: profile.photos?.[0]?.value },
    create: {
      email,
      name: profile.displayName,
      oauthProvider: provider,
      oauthId: profile.id,
      avatar: profile.photos?.[0]?.value,
    },
  });
};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  }, async (_, __, profile, done) => {
    try { done(null, await upsertOAuthUser('google', profile)); }
    catch (e) { done(e); }
  }));
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  const GitHubStrategy = require('passport-github2').Strategy;
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/auth/github/callback',
    scope: ['user:email'],
  }, async (_, __, profile, done) => {
    try { done(null, await upsertOAuthUser('github', profile)); }
    catch (e) { done(e); }
  }));
}
