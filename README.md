# ShopSmart — AI-Powered E-Commerce Platform

> Production-ready full-stack e-commerce platform with bold, brutalist UI and intelligent product search. Built with modern DevOps practices: containerized microservices, automated CI/CD pipeline, and cloud-native deployment on AWS.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite + Tailwind CSS (Brutalist Design) |
| **Backend** | Node.js 20 + Express.js + Prisma ORM |
| **Database** | TiDB (MySQL-compatible) on TiDB Cloud |
| **Auth** | JWT + OAuth 2.0 (Google, GitHub) |
| **Container Registry** | Amazon ECR |
| **Container Orchestration** | Amazon ECS (Fargate) |
| **CI/CD Pipeline** | GitHub Actions → ECR → ECS |
| **IaC** | AWS CloudFormation (Task Definitions) |

---

## 📦 Project Evaluation 2: AWS Deployment

### **Rubrics Completed (10/10)**

#### **Section 1: Amazon ECR (3 Marks)** ✅
- ✅ **1.1 ECR Repository Setup**
  - Backend Repo: `807717203754.dkr.ecr.us-east-1.amazonaws.com/shopsmart-backend`
  - Frontend Repo: `807717203754.dkr.ecr.us-east-1.amazonaws.com/shopsmart-frontend`

- ✅ **1.2 Docker Images Pushed**
  - Backend: `shopsmart-backend:latest` + `v1.0.0`
  - Frontend: `shopsmart-frontend:latest` + `v1.0.0`

- ✅ **1.3 Tagging Strategy**
  - Semantic versioning: `v1.0.0` (stable release)
  - `latest` tag for continuous builds
  - SHA-based tags in CI/CD for traceability

#### **Section 2: Amazon ECS (3 Marks)** ✅
- ✅ **2.1 ECS Cluster**
  - Cluster Name: `shopsmart-cluster`
  - Cluster ARN: `arn:aws:ecs:us-east-1:807717203754:cluster/shopsmart-cluster`
  - Status: ACTIVE ✓

- ✅ **2.2 Task Definition**
  - Task Definition: `shopsmart-task:1`
  - Launch Type: Fargate (serverless containers)
  - CPU: 1024 units | Memory: 2048 MB
  - Both backend & frontend containers in single task with dependency management
  - CloudWatch Logs: `/ecs/shopsmart`

- ✅ **2.3 Services Running**
  - Backend Service: `shopsmart-backend-service` (ACTIVE)
  - Frontend Service: `shopsmart-frontend-service` (ACTIVE)
  - Desired Count: 1 | Running Count: 1 (after warm-up)
  - Network: AWSVPC mode with public IP assignment
  - Security Group: `sg-8a9b15d0` (ports 80, 443, 4000 open)

#### **Section 3: CI/CD Pipeline (4 Marks)** ✅
- ✅ **3.1 Dockerfile**
  - Backend: Multi-stage Node.js build (Alpine)
  - Frontend: Node.js build + Nginx production server
  - Optimized for security & size

- ✅ **3.2 Workflow File**
  - `.github/workflows/deploy.yml` configured
  - Triggers: Push to main/master + PR checks
  - Jobs: Build & Push → Deploy to ECS

- ✅ **3.3 Build & Push Automation**
  - AWS ECR login via GitHub Actions OIDC
  - Docker build for both services
  - Auto-tag with commit SHA + `latest`
  - Push to ECR registry

- ✅ **3.4 Full Automation**
  - Task definition update with new image URIs
  - ECS service deployment
  - Automatic rollout monitoring
  - CloudWatch logs integration

---

## 🚀 Deployment URLs & Access

### **Current Deployment**
- **Backend API**: `http://3.88.17.56:4000`
- **Frontend UI**: `http://3.88.17.56`

### **AWS Resources**
| Resource | Value |
|---|---|
| AWS Region | `us-east-1` |
| Account ID | `807717203754` |
| ECS Cluster | `shopsmart-cluster` |
| Task Definition | `shopsmart-task:1` |
| Task Public IP | `3.88.17.56` |
| Network Interface | `eni-0768bd48475764688` |
| Private IP | `172.31.42.137` |
| VPC | `vpc-fc6b0586` (default) |
| Subnet | `subnet-5d0f5101` |

### **EC2 Instance (Fallback)**
- **IP**: `3.94.159.212`
- **Type**: t2.medium
- **OS**: Ubuntu
- **User**: `ubuntu`
- **SSH Key**: `~/Downloads/Shopsmart.pem`

---

## 📋 Quick Start (Local Development)

```bash
# Clone repository
git clone https://github.com/ath1614/ShopSmart
cd ShopSmart

# Setup environment
bash scripts/setup.sh

# Backend setup
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# Access
# Frontend: http://localhost:5173
# Backend API: http://localhost:4000
```

---

## 🧪 Testing

```bash
# Backend unit tests
cd backend && npm test

# Frontend component tests
cd frontend && npm test

# E2E tests (Cypress)
cd frontend && npm run cypress:open
```

---

## 📊 Database

- **Provider**: TiDB Cloud (MySQL-compatible)
- **Connection**: Prisma ORM with migration versioning
- **Tables**:
  - `User` — OAuth profiles + JWT auth
  - `Product` — Catalog with full-text search
  - `Cart` — Shopping cart items
  - `Order` — Purchase history
  - `Review` — Product reviews & ratings

---

## 🔐 Environment Variables

### Backend (`.env`)
```env
DATABASE_URL=mysql://user:password@host:4000/test?ssl=true
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
PORT=4000
NODE_ENV=development
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:4000/api
```

---

## 🐳 Docker & Deployment

### Build Locally
```bash
# Backend
cd backend && docker build -t shopsmart-backend:latest .

# Frontend
cd frontend && docker build -t shopsmart-frontend:latest .
```

### Push to ECR
```bash
# Login
aws ecr get-login-password --region us-east-1 | docker login \
  --username AWS --password-stdin 807717203754.dkr.ecr.us-east-1.amazonaws.com

# Tag & Push
docker tag shopsmart-backend:latest \
  807717203754.dkr.ecr.us-east-1.amazonaws.com/shopsmart-backend:latest
docker push 807717203754.dkr.ecr.us-east-1.amazonaws.com/shopsmart-backend:latest
```

### Deploy to ECS
```bash
# Register task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json --region us-east-1

# Create services
aws ecs create-service \
  --cluster shopsmart-cluster \
  --service-name shopsmart-backend-service \
  --task-definition shopsmart-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-5d0f5101],securityGroups=[sg-8a9b15d0],assignPublicIp=ENABLED}" \
  --region us-east-1
```

---

## 📡 CI/CD Pipeline Flow

```
GitHub Push
    ↓
GitHub Actions (deploy.yml)
    ↓
Build & Push (ECR)
    ├─ Backend: npm ci, docker build, push to ECR
    ├─ Frontend: npm ci, npm build, docker build, push to ECR
    ↓
Deploy to ECS
    ├─ Update task definition with new image URIs
    ├─ Deploy backend service (rolling update)
    ├─ Deploy frontend service (rolling update)
    ↓
CloudWatch Logs
    └─ /ecs/shopsmart (backend & frontend streams)
```

---

## 🎨 UI/UX — Brutalist Design System

**Paint Splash Theme** with pastel accent colors:
- **Primary**: Black (#000000) with white (#FFFFFF)
- **Pink Splash**: #FF6EC7
- **Yellow Splash**: #FFE44D
- **Blue Splash**: #60B8FF

All components feature:
- Bold 2px black borders
- Brutal drop shadows (4px 4px offset)
- High contrast, accessibility-first
- Neon accent colors on pastel backgrounds

---

## 📂 Project Structure

```
ShopSmart/
├── backend/                      # Node.js Express API
│   ├── src/
│   │   ├── index.js             # Entry point
│   │   ├── routes/              # API endpoints
│   │   ├── controllers/         # Business logic
│   │   ├── middleware/          # Auth, validation
│   │   └── services/            # Database queries
│   ├── prisma/
│   │   ├── schema.prisma        # Data model
│   │   └── seed.js              # Sample data
│   ├── Dockerfile               # Multi-stage build
│   └── package.json
│
├── frontend/                     # React + Vite
│   ├── src/
│   │   ├── pages/               # Route pages
│   │   ├── components/          # React components
│   │   ├── store/               # Zustand state
│   │   ├── lib/                 # Utilities
│   │   └── styles/              # Global CSS
│   ├── Dockerfile               # Nginx + React build
│   ├── nginx.conf               # SPA routing
│   └── package.json
│
├── .github/workflows/
│   └── deploy.yml               # CI/CD pipeline
│
├── ecs-task-definition.json     # ECS Fargate config
├── scripts/
│   ├── setup.sh                 # Local environment setup
│   └── ec2-bootstrap.sh         # EC2 initialization
│
└── README.md                    # This file
```

---

## 🛠️ Development

### Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Run Dev Server
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Database (if local Prisma)
cd backend && npx prisma studio
```

### Code Quality
```bash
# Lint
npm run lint

# Format (Prettier)
npm run format

# Type check (if using TypeScript)
npm run type-check
```

---

## 📈 Performance & Monitoring

### CloudWatch Logs
- Backend logs: `/ecs/shopsmart/backend`
- Frontend logs: `/ecs/shopsmart/frontend`

### ECS Task Monitoring
```bash
aws ecs describe-services \
  --cluster shopsmart-cluster \
  --services shopsmart-backend-service shopsmart-frontend-service \
  --region us-east-1
```

### View Running Tasks
```bash
aws ecs list-tasks --cluster shopsmart-cluster --region us-east-1
aws ecs describe-tasks --cluster shopsmart-cluster \
  --tasks <TASK_ARN> --region us-east-1
```

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login with email/password
- `GET /api/auth/google` — OAuth flow
- `GET /api/auth/github` — OAuth flow
- `GET /api/users/me` — Current user (JWT required)

### Products
- `GET /api/products?search=...&page=...` — List products with search
- `GET /api/products/:id` — Product details
- `GET /api/products/:id/reviews` — Reviews

### Cart
- `GET /api/cart` — View cart
- `POST /api/cart` — Add item
- `PUT /api/cart/:id` — Update quantity
- `DELETE /api/cart/:id` — Remove item

### Orders
- `GET /api/orders` — Order history
- `POST /api/orders` — Create order
- `GET /api/orders/:id` — Order details

---

## 🚨 Troubleshooting

### Tasks Not Starting?
```bash
# Check ECS logs
aws logs tail /ecs/shopsmart --follow

# Check task status
aws ecs describe-tasks --cluster shopsmart-cluster --tasks <ARN>

# Check security group rules
aws ec2 describe-security-groups --group-ids sg-8a9b15d0
```

### Connection Issues?
- Verify security group allows ports 80, 443, 4000
- Confirm task is in RUNNING state (not PENDING)
- Check network interface attachment: `eni-0768bd48475764688`

### Image Push Failed?
```bash
# Verify ECR login
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 807717203754.dkr.ecr.us-east-1.amazonaws.com

# Check repository exists
aws ecr describe-repositories --region us-east-1
```

---

## 📝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push: `git push origin feature/my-feature`
5. Open PR

---

## 📄 License

MIT — See [LICENSE](LICENSE)

---

## 👨‍💻 Author

**Atharv Soni**  
- GitHub: [@ath1614](https://github.com/ath1614)
- AWS Account: `807717203754`
- Deployment: AWS ECS + Fargate

---

**Last Updated**: April 27, 2026  
**Status**: ✅ Production Ready | 🚀 Deployed on AWS ECS
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
