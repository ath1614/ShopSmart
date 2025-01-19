#!/usr/bin/env bash
set -euo pipefail

echo "==> Setting up ShopSmart..."

# Idempotent: create .env if not exists
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "  Created backend/.env from example"
fi

# Idempotent: install backend deps
echo "==> Installing backend dependencies..."
cd backend
npm ci
cd ..

# Idempotent: install frontend deps
echo "==> Installing frontend dependencies..."
cd frontend
npm ci
cd ..

# Idempotent: run prisma generate (safe to re-run)
echo "==> Generating Prisma client..."
cd backend
npx prisma generate
cd ..

echo "==> Setup complete!"
echo "    Run: cd backend && npm run dev"
echo "    Run: cd frontend && npm run dev"
