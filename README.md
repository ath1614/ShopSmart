# ShopSmart — AI-Powered E-Commerce Platform

> Production-ready full-stack e-commerce platform with bold, brutalist UI and intelligent product search. Built with modern DevOps practices: containerized microservices, automated CI/CD pipeline, and cloud-native deployment on AWS.

---

## Live Deployment

| Service | URL |
|---|---|
| Backend API | `http://54.89.151.90:4000` |
| Health Check | `http://54.89.151.90:4000/health` |
| Frontend | `http://54.242.97.121` |

---

## Architecture & Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS (Brutalist Paint Splash Theme) |
| Backend | Node.js 20 + Express.js + Prisma ORM |
| Database | TiDB Cloud (MySQL-compatible) |
| Auth | JWT + OAuth 2.0 (Google, GitHub) |
| Icons | Lucide React (vector icons) |
| Container Registry | Amazon ECR |
| Container Orchestration | Amazon ECS (Fargate) |
| CI/CD Pipeline | GitHub Actions → ECR → ECS |
| IaC | AWS CloudFormation / ECS Task Definitions |

---

## Project Evaluation 2: AWS Deployment

### Section 1: Amazon ECR (3 Marks) ✅

#### 1.1 ECR Repository Setup
- Backend Repo: `807717203754.dkr.ecr.us-east-1.amazonaws.com/shopsmart-backend`
- Frontend Repo: `807717203754.dkr.ecr.us-east-1.amazonaws.com/shopsmart-frontend`

**Verify:**
```bash
aws ecr describe-repositories --repository-names shopsmart-backend --region us-east-1 \
  --query "repositories[0].{URI:repositoryUri,Scan:imageScanningConfiguration.scanOnPush}" \
  --output table
```

#### 1.2 Docker Images Pushed
- Backend: `shopsmart-backend:latest` + `shopsmart-backend:v1.0.0`
- Frontend: `shopsmart-frontend:latest` + `shopsmart-frontend:v1.0.0`

**Verify:**
```bash
aws ecr list-images --repository-name shopsmart-backend --region us-east-1 \
  --query "imageIds[*].{Tag:imageTag,Digest:imageDigest}" --output table
```

#### 1.3 Tagging Strategy
- `latest` — always points to most recent build
- `v1.0.0` — semantic versioning for stable release
- `<git-sha>` — commit SHA tags in CI/CD for full traceability

**Verify:**
```bash
aws ecr list-images --repository-name shopsmart-backend --region us-east-1 \
  --query "imageIds[*].imageTag" --output text
```

---

### Section 2: Amazon ECS (3 Marks) ✅

#### 2.1 ECS Cluster
- Cluster Name: `shopsmart-cluster`
- Cluster ARN: `arn:aws:ecs:us-east-1:807717203754:cluster/shopsmart-cluster`
- Status: ACTIVE

**Verify:**
```bash
aws ecs describe-clusters --clusters shopsmart-cluster --region us-east-1 \
  --query "clusters[0].{Name:clusterName,Status:status,Provider:capacityProviders}" \
  --output table
```

#### 2.2 Task Definition
- Task Definition: `shopsmart-task`
- Launch Type: Fargate (serverless containers)
- CPU: 1024 units | Memory: 2048 MB
- Backend container: port 4000 | Frontend container: port 80
- Execution Role: `LabRole`
- CloudWatch Logs: `/ecs/shopsmart`

**Verify:**
```bash
aws ecs describe-task-definition --task-definition shopsmart-task --region us-east-1 \
  --query "taskDefinition.{Family:family,Launch:requiresCompatibilities,Role:executionRoleArn,Image:containerDefinitions[0].image,Port:containerDefinitions[0].portMappings[0].containerPort}" \
  --output table
```

#### 2.3 Services Running
- Backend Service: `shopsmart-backend-service` — ACTIVE, Running: 1, Desired: 1
- Frontend Service: `shopsmart-frontend-service` — ACTIVE
- Network: AWSVPC mode with public IP assignment
- Security Group: `sg-8a9b15d0` (ports 80, 443, 4000 open)

**Verify:**
```bash
aws ecs describe-services --cluster shopsmart-cluster --services shopsmart-backend-service \
  --region us-east-1 \
  --query "services[0].{Status:status,Running:runningCount,Desired:desiredCount,PublicIP:networkConfiguration.awsvpcConfiguration.assignPublicIp}" \
  --output table
```

---

### Section 3: CI/CD Pipeline (4 Marks) ✅

#### 3.1 Dockerfile
- Backend: `backend/Dockerfile` — Node.js 20 Alpine + OpenSSL + Prisma generate
- Frontend: `frontend/Dockerfile` — Multi-stage: Node build → Nginx production server

#### 3.2 Workflow File
- `.github/workflows/deploy.yml` — GitHub Actions → ECR → ECS
- `.github/workflows/ci.yml` — Lint + Test on push/PR
- `.github/workflows/pr-checks.yml` — Lint gate on PRs
- `.github/workflows/e2e.yml` — Cypress E2E tests

#### 3.3 Build & Push Automation
- AWS credentials via GitHub Secrets (OIDC)
- Docker buildx for `linux/amd64` platform (ECS Fargate compatible)
- Auto-tag with commit SHA + `latest`
- Push both backend and frontend to ECR

#### 3.4 Full Automation
- Task definition updated with new image URIs on every push to main
- ECS backend + frontend services redeployed automatically
- `wait-for-service-stability: true` — waits for healthy deployment
- CloudWatch logs integration: `/ecs/shopsmart`

---

## AWS Resources

| Resource | Value |
|---|---|
| AWS Region | `us-east-1` |
| Account ID | `807717203754` |
| ECS Cluster | `shopsmart-cluster` |
| Task Definition | `shopsmart-task` |
| Backend Service | `shopsmart-backend-service` |
| Frontend Service | `shopsmart-frontend-service` |
| Backend Task IP | `54.89.151.90` |
| Frontend Task IP | `54.242.97.121` |
| ECR Backend | `807717203754.dkr.ecr.us-east-1.amazonaws.com/shopsmart-backend` |
| ECR Frontend | `807717203754.dkr.ecr.us-east-1.amazonaws.com/shopsmart-frontend` |
| Security Group | `sg-8a9b15d0` |
| VPC | `vpc-fc6b0586` |
| Subnet | `subnet-5d0f5101` |

---

## EC2 Instance (Fallback)

| Property | Value |
|---|---|
| IP | `3.94.159.212` |
| Type | t2.medium |
| OS | Ubuntu |
| User | `ubuntu` |
| SSH Key | `~/Downloads/Shopsmart.pem` |

---

## Quick Start (Local Development)

```bash
# Clone
git clone https://github.com/ath1614/ShopSmart
cd ShopSmart

# Setup (idempotent)
bash scripts/setup.sh

# Backend
cd backend
cp .env.example .env   # fill in your values
npm install
npx prisma db push
npx prisma db seed
npm run dev            # http://localhost:4000

# Frontend (new terminal)
cd frontend
npm install
npm run dev            # http://localhost:5173
```

---

## Testing

```bash
# Backend unit + integration tests
cd backend && npm test

# Frontend unit tests
cd frontend && npm test

# E2E tests (Cypress)
cd frontend && npm run cypress:open
```

---

## CI/CD Pipeline Flow

```
GitHub Push to main
        ↓
GitHub Actions (deploy.yml)
        ↓
Build & Push (ECR)
    ├─ Backend:  docker buildx --platform linux/amd64 → ECR :sha + :latest
    └─ Frontend: docker buildx --platform linux/amd64 → ECR :sha + :latest
        ↓
Deploy to ECS
    ├─ Download current task definition
    ├─ Update backend container image URI
    ├─ Update frontend container image URI
    ├─ Register new task definition revision
    ├─ Deploy backend service (rolling update)
    └─ Deploy frontend service (rolling update)
        ↓
CloudWatch Logs
    └─ /ecs/shopsmart (backend + frontend streams)
```

---

## Database

- Provider: TiDB Cloud (MySQL-compatible, hosted on AWS ap-southeast-1)
- ORM: Prisma with migration versioning
- Tables: `User`, `Product`, `Category`, `Cart`, `Order`, `OrderItem`, `Review`, `WishlistItem`, `Address`

---

## Environment Variables

### Backend (`.env`)
```env
DATABASE_URL=mysql://user:password@host:4000/test?ssl=true&sslaccept=strict
JWT_SECRET=your-jwt-secret
CLIENT_URL=http://localhost:5173
PORT=4000
NODE_ENV=development
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:4000/api
```

---

## UI Theme

Paint Splash / Brutalist Design:
- Base: White `#FFFFFF` / Off-white `#FAFAFA`
- Pink Splash: `#FF6EC7`
- Yellow Splash: `#FFE44D`
- Blue Splash: `#60B8FF`
- Bold 2px black borders + hard offset shadows (`4px 4px 0px #000`)
- Lucide React vector icons throughout

---

## Project Structure

```
ShopSmart/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # DB schema
│   │   └── seed.js             # Sample data (25 products, 8 categories)
│   ├── src/
│   │   ├── index.js            # Express server entry
│   │   ├── middleware/         # JWT auth, Passport OAuth
│   │   └── routes/             # auth, products, cart, orders, users
│   ├── Dockerfile              # Node 20 Alpine + OpenSSL
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Products, Cart, Orders
│   │   ├── components/         # Navbar (shared layout)
│   │   ├── store/              # Zustand auth store
│   │   └── lib/api.js          # Axios with JWT interceptor
│   ├── cypress/e2e/            # E2E tests
│   ├── Dockerfile              # Multi-stage: Node build + Nginx
│   └── nginx.conf              # SPA routing + API proxy
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Lint + Test on push/PR
│   │   ├── deploy.yml          # ECR + ECS deployment
│   │   ├── pr-checks.yml       # Lint gate on PRs
│   │   └── e2e.yml             # Cypress E2E
│   ├── dependabot.yml          # Weekly dependency updates
│   └── PULL_REQUEST_TEMPLATE.md
├── ecs-task-definition.json    # ECS Fargate config
└── scripts/
    ├── setup.sh                # Idempotent local setup
    └── ec2-bootstrap.sh        # Idempotent EC2 init
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/google` | No | Google OAuth |
| GET | `/api/auth/github` | No | GitHub OAuth |
| GET | `/api/users/me` | JWT | Current user |
| GET | `/api/products` | JWT | List + search products |
| GET | `/api/products/:id` | JWT | Product detail + reviews |
| POST | `/api/products` | SELLER | Create product |
| GET | `/api/cart` | JWT | View cart |
| POST | `/api/cart` | JWT | Add to cart |
| PUT | `/api/cart/:id` | JWT | Update quantity |
| DELETE | `/api/cart/:id` | JWT | Remove item |
| GET | `/api/orders` | JWT | Order history |
| POST | `/api/orders` | JWT | Place order |
| GET | `/api/orders/:id` | JWT | Order detail |

---

## Author

**Atharv Soni**
- GitHub: [@ath1614](https://github.com/ath1614)
- Email: atharv.soni@adypu.edu.in
- AWS Account: `807717203754`

---

**Status**: Production Ready | Deployed on AWS ECS Fargate
**Last Updated**: April 2026
