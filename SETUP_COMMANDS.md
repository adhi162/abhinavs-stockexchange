# Commands to Run Senate Exchange Locally

## 📋 Repository Overview

**Senate Exchange** is a full-stack currency exchange platform with:
- **Frontend**: React 18 + TypeScript + Vite (runs on port 8080)
- **Backend**: Node.js + Express + TypeScript (runs on port 3000)
- **Database**: PostgreSQL 15

---

## 🐳 Option 1: Docker (Easiest - Recommended)

### Prerequisites
- Docker Desktop installed and running
- Docker Compose installed

### Commands

```powershell
# Navigate to project directory
cd A:\MyProjects\lovable

# Start all services (database + app)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

**Access Points:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:8080/api
- Health Check: http://localhost:8080/health

---

## 🏃 Option 2: Local Development (Without Docker)

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 15+ (or use Docker for DB only)

### Step 1: Setup Database

**Option A: Docker for Database Only**
```powershell
docker run --name senate-db -e POSTGRES_USER=senate -e POSTGRES_PASSWORD=senate_password -e POSTGRES_DB=senate_exchange -p 5432:5432 -d postgres:15-alpine
```

**Option B: Local PostgreSQL**
```powershell
# Create database (if using local PostgreSQL)
createdb senate_exchange
```

### Step 2: Setup Backend

```powershell
# Navigate to backend
cd A:\MyProjects\lovable\backend

# Install dependencies
npm install

# Create .env file
@"
DATABASE_URL="postgresql://senate:senate_password@localhost:5432/senate_exchange"
JWT_SECRET="dev-jwt-secret"
MFA_SECRET="SENATEEXCHANGEADMINADMIN"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:8080"
"@ | Out-File -FilePath .env -Encoding utf8

# Run database migrations
npx prisma migrate dev
npx prisma generate

# Start backend (in development mode)
npm run dev
```

Backend will run on: http://localhost:3000

### Step 3: Setup Frontend (New Terminal)

```powershell
# Navigate to frontend
cd A:\MyProjects\lovable\frontend

# Install dependencies
npm install

# Create .env file
@"
VITE_API_URL=http://localhost:3000/api
"@ | Out-File -FilePath .env -Encoding utf8

# Start frontend development server
npm run dev
```

Frontend will run on: http://localhost:8080

---

## 🔐 Admin Panel Access

### Default Credentials

| Email | Password |
|-------|----------|
| `adhiadarsh91@gmail.com` | `admin123` |
| `admin@senate.exchange` | `senate2024` |
| `operator@senate.exchange` | `operator123` |

### Google Authenticator Setup

1. Navigate to `/admin` page
2. MFA Secret: `SENATEEXCHANGEADMINADMIN`
3. Add to Google Authenticator app
4. Use 6-digit code for MFA verification

---

## 🛠️ Useful Commands

### Backend Commands
```powershell
cd A:\MyProjects\lovable\backend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database management
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create and apply migration
npx prisma generate        # Generate Prisma client
```

### Frontend Commands
```powershell
cd A:\MyProjects\lovable\frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Docker Commands
```powershell
# View running containers
docker ps

# View logs
docker-compose logs -f app
docker-compose logs -f postgres

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d

# Access container shell
docker exec -it senate-app sh
```

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Kill process on port (PowerShell)
Get-NetTCPConnection -LocalPort 8080 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
Get-NetTCPConnection -LocalPort 5432 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

### Database Connection Issues
- Verify PostgreSQL is running: `docker ps` (if using Docker)
- Check DATABASE_URL in backend/.env
- Ensure database exists and credentials are correct

### Prisma Issues
```powershell
cd A:\MyProjects\lovable\backend
npx prisma generate
npx prisma migrate reset  # WARNING: Deletes all data (dev only)
```

### Frontend Build Errors
```powershell
cd A:\MyProjects\lovable\frontend
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

---

## 📁 Project Structure

```
lovable/
├── frontend/          # React frontend
│   ├── src/          # Source code
│   └── package.json  # Frontend dependencies
├── backend/          # Node.js backend
│   ├── src/         # Source code
│   ├── prisma/      # Database schema
│   └── package.json # Backend dependencies
├── docker-compose.yml # Docker setup
└── Dockerfile        # Container build
```

---

## ✅ Quick Start Checklist

- [ ] Install Node.js 18+
- [ ] Install Docker Desktop (for Docker option)
- [ ] Clone repository
- [ ] Choose Docker or Local setup
- [ ] Setup database
- [ ] Install backend dependencies
- [ ] Create backend .env file
- [ ] Run Prisma migrations
- [ ] Start backend server
- [ ] Install frontend dependencies
- [ ] Create frontend .env file
- [ ] Start frontend server
- [ ] Access http://localhost:8080

