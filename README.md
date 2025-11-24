# Senate Exchange - Currency Exchange Platform

A modern currency exchange platform for Nepal, built with React and TypeScript. This application provides real-time exchange rates, commission management, and an admin panel for managing operations.

## 📋 Project Overview

Senate Exchange is a full-stack currency exchange platform that allows users to:
- View real-time exchange rates for multiple currencies (RUB, USD, EUR, KZT, USDT, BTC → NPR)
- Calculate exchange quotes with live rates
- Access admin panel for managing currencies, rates, and settings
- Secure authentication with Google Authenticator MFA

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui component library
- React Router for routing
- React Query for data fetching

**Backend:**
- Node.js with Express
- PostgreSQL database
- Prisma ORM
- JWT authentication
- Google Authenticator (TOTP) for MFA

**Deployment:**
- Single Docker container (Frontend + Backend)
- AWS ECS compatible
- Nginx for frontend serving
- Supervisord for process management

## 📁 Project Structure

```
lovable/
├── frontend/              # React frontend application
│   ├── src/              # Source code
│   ├── public/           # Public assets
│   ├── package.json      # Frontend dependencies
│   └── vite.config.ts    # Vite configuration
├── backend/              # Node.js backend API
│   ├── src/             # Source code
│   ├── prisma/          # Database schema
│   ├── package.json     # Backend dependencies
│   └── tsconfig.json    # TypeScript config
├── Dockerfile            # Single container build
├── docker-compose.yml    # Local development setup
├── nginx.conf           # Nginx configuration
├── supervisord.conf      # Process manager config
└── start.sh             # Container startup script
```

## 🚀 Quick Start (Docker - Recommended)

### Prerequisites

- **Docker** and **Docker Compose** installed
- **Git**

### Step 1: Clone Repository

```bash
git clone <your-repo-url>
cd lovable
```

### Step 2: Start Everything with Docker Compose

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL database
- Build and start the application (frontend + backend in single container)
- Run database migrations automatically
- Make everything available on `http://localhost:8080`

### Step 3: Access the Application

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:8080/api
- **Health Check:** http://localhost:8080/health
- **Admin Panel:** http://localhost:8080/admin

### Step 4: View Logs

```bash
# View all logs
docker-compose logs -f

# View app logs only
docker-compose logs -f app

# View database logs only
docker-compose logs -f postgres
```

### Step 5: Stop Services

```bash
docker-compose down
```

To remove volumes (database data):
```bash
docker-compose down -v
```

## 🏃 Running Locally (Without Docker)

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 15+ running locally

### Step 1: Setup Database

**Option A: Using Docker (Easiest)**
```bash
docker run --name senate-db \
  -e POSTGRES_USER=senate \
  -e POSTGRES_PASSWORD=senate_password \
  -e POSTGRES_DB=senate_exchange \
  -p 5432:5432 \
  -d postgres:15-alpine
```

**Option B: Local PostgreSQL**
```bash
createdb senate_exchange
```

### Step 2: Setup Backend

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create `backend/.env`:
   ```env
   DATABASE_URL="postgresql://senate:senate_password@localhost:5432/senate_exchange"
   JWT_SECRET="dev-jwt-secret"
   MFA_SECRET="SENATEEXCHANGEADMINADMIN"
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL="http://localhost:8080"
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start backend:**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:3000`

### Step 3: Setup Frontend

1. **In a new terminal, navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start frontend:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:8080`

### Step 4: Access Application

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api
- Admin Panel: http://localhost:8080/admin

## 🔐 Admin Panel Access

### Default Credentials

| Email | Password |
|-------|----------|
| `adhiadarsh91@gmail.com` | `admin123` |
| `admin@senate.exchange` | `senate2024` |
| `operator@senate.exchange` | `operator123` |

### Setup Google Authenticator

1. Navigate to `/admin` page
2. Copy the MFA secret: `SENATEEXCHANGEADMINADMIN`
3. Open Google Authenticator app
4. Tap "+" → "Enter a setup key"
5. Enter:
   - **Account name:** Your email
   - **Key:** `SENATEEXCHANGEADMINADMIN`
   - **Type:** Time-based
6. Save and use the 6-digit code for MFA verification

## 🐳 Docker Commands

### Build Image

```bash
docker build -t senate-exchange .
```

### Run Container

```bash
docker run -d \
  --name senate-app \
  -p 8080:80 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  senate-exchange
```

### View Logs

```bash
docker logs -f senate-app
```

### Execute Commands in Container

```bash
# Run migrations
docker exec senate-app sh -c "cd /app/backend && npx prisma migrate deploy"

# Access shell
docker exec -it senate-app sh
```

## 🚢 Deployment to AWS ECS

### Prerequisites

- AWS Account
- AWS CLI installed and configured
- Docker installed locally
- ECR repository created
- ECS cluster configured
- RDS PostgreSQL instance (or use containerized DB)

### Step 1: Build and Push to ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t senate-exchange .

# Tag image
docker tag senate-exchange:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/senate-exchange:latest

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/senate-exchange:latest
```

### Step 2: Create ECS Task Definition

Create `task-definition.json`:

```json
{
  "family": "senate-exchange",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "senate-app",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/senate-exchange:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://user:pass@rds-endpoint:5432/senate_exchange"
        },
        {
          "name": "JWT_SECRET",
          "value": "your-production-jwt-secret"
        },
        {
          "name": "MFA_SECRET",
          "value": "SENATEEXCHANGEADMINADMIN"
        },
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "FRONTEND_URL",
          "value": "https://yourdomain.com"
        },
        {
          "name": "RUN_MIGRATIONS",
          "value": "true"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/senate-exchange",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget --quiet --tries=1 --spider http://localhost/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 40
      }
    }
  ]
}
```

### Step 3: Register Task Definition

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### Step 4: Create/Update ECS Service

```bash
aws ecs create-service \
  --cluster senate-exchange-cluster \
  --service-name senate-exchange-service \
  --task-definition senate-exchange \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:xxx:targetgroup/xxx,containerName=senate-app,containerPort=80"
```

### Step 5: Setup Application Load Balancer

1. Create ALB in AWS Console
2. Configure target group (port 80)
3. Configure HTTPS listener (port 443) with SSL certificate
4. Attach to ECS service

### Step 6: Setup RDS PostgreSQL

```bash
aws rds create-db-instance \
  --db-instance-identifier senate-exchange-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <secure-password> \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxx \
  --db-subnet-group-name default
```

### Step 7: Environment Variables

Use AWS Systems Manager Parameter Store:

```bash
aws ssm put-parameter --name "/senate/jwt-secret" --value "your-secret" --type "SecureString"
aws ssm put-parameter --name "/senate/database-url" --value "postgresql://..." --type "SecureString"
```

Update task definition to reference these parameters.

## 🔧 Development Scripts

### Frontend

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend

```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript
npm start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio (database GUI)
```

## 🗄️ Database Management

### Run Migrations

```bash
cd backend
npx prisma migrate dev      # Development (creates migration)
npx prisma migrate deploy   # Production (applies migrations)
```

### View Database

```bash
cd backend
npx prisma studio
```

### Reset Database (Development Only)

```bash
cd backend
npx prisma migrate reset
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based session management
- Google Authenticator MFA (TOTP)
- Email whitelist for admin access
- Comprehensive audit logging
- CORS protection
- Input validation
- Helmet.js security headers

## 📝 API Endpoints

- `GET /health` - Health check
- `GET /api` - API info
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/mfa/verify` - Verify MFA code
- `POST /api/auth/logout` - Logout
- `GET /api/currencies` - List currencies
- `GET /api/rates` - Get exchange rates
- `GET /api/audit-logs` - View audit logs
- ... (see BACKEND_MIGRATION_ANALYSIS.md for complete list)

## 🐛 Troubleshooting

### Docker Issues

**Container won't start:**
```bash
# Check logs
docker-compose logs app

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

**Database connection errors:**
- Verify PostgreSQL is running: `docker-compose ps`
- Check DATABASE_URL in environment
- Ensure network connectivity between containers

### Local Development Issues

**Port already in use:**
```bash
# Kill process on port
npx kill-port 8080  # Frontend
npx kill-port 3000  # Backend
npx kill-port 5432  # Database
```

**Prisma errors:**
```bash
cd backend
npx prisma generate
npx prisma migrate reset  # Development only
```

**Frontend build errors:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### AWS ECS Issues

**Container not starting:**
- Check CloudWatch logs
- Verify environment variables
- Check security group rules
- Verify task definition

**Database connection from ECS:**
- Ensure RDS security group allows ECS security group
- Verify VPC configuration
- Check database endpoint

## 📚 Additional Resources

- [Backend Migration Plan](./BACKEND_MIGRATION_ANALYSIS.md) - Complete migration guide
- [Prisma Documentation](https://www.prisma.io/docs)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

[Your License Here]

## 👥 Support

For issues or questions:
- Email: desk@senate.exchange
- WhatsApp: +977 9841 234 567

---

## 🎯 Single Container Architecture

This project uses a **single container** approach where:
- **Frontend** is built as static files and served by Nginx
- **Backend** runs as a Node.js process
- **Supervisord** manages both processes
- **Nginx** proxies `/api/*` requests to the backend

**Benefits:**
- Simpler deployment (one container to manage)
- Lower resource usage
- Easier to scale (scale the container)
- Single health check endpoint

**Considerations:**
- Both services scale together
- For very high traffic, consider separate containers
- Current setup is ideal for most use cases

---

**Note:** Backend migration is in progress. The frontend currently works standalone. Full backend integration will be completed according to the migration plan in `BACKEND_MIGRATION_ANALYSIS.md`.
