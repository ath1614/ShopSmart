# Contributing to ShopSmart

## Workflow
- Branch from `main` using `feat/`, `fix/`, `chore/` prefixes
- Commit using conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
- Open a PR — CI must pass before merge

## Setup
```bash
bash scripts/setup.sh
```

## Running Locally
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

## Tests
```bash
cd backend && npm test
cd frontend && npm test
```

## Linting
```bash
cd backend && npm run lint
cd frontend && npm run lint
```
