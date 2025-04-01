# ShopSmart

> AI-powered full-stack e-commerce platform — bold, fast, production-ready.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + Google/GitHub OAuth |
| CI/CD | GitHub Actions + EC2 |

## Quick Start

```bash
# Clone
git clone https://github.com/ath1614/ShopSmart
cd ShopSmart

# Setup (idempotent)
bash scripts/setup.sh

# Copy and fill env
cp backend/.env.example backend/.env

# Run
cd backend && npm run dev
cd frontend && npm run dev
```

## UI Flow

```
Landing Page → Login / Register (OAuth) → Dashboard → Products → Cart → Orders
```

## Testing

```bash
cd backend && npm test
cd frontend && npm test
```

## CI/CD

- `ci.yml` — runs lint + tests on every push and PR
- `pr-checks.yml` — lint gate on all PRs
- `deploy.yml` — SSH deploy to EC2 on push to main
- `dependabot.yml` — weekly dependency updates

## Architecture

```
React (Vite) → Express API → Prisma ORM → PostgreSQL
                    ↓
              JWT + OAuth
                    ↓
           GitHub Actions → EC2
```

## Author

Atharv Soni — [atharv.soni@adypu.edu.in](mailto:atharv.soni@adypu.edu.in)
