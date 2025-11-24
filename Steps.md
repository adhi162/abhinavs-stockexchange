Local Run (no Docker)
Backend
Stack: Node.js + Express + TypeScript.
Persist data in a JSON file (e.g., data/users.json and data/rates.json) stored under backend/ and accessed via the fs module.
Encrypt hashed passwords with bcrypt before writing to JSON.
Expose REST routes for auth, rates, audit logs, etc.
Steps:
cd backend
cp .env.example .env (configure JSON_DATA_PATH=./data, PORT=3000, FRONTEND_URL).
npm install
npm run dev
The server watches the JSON files; on startup it loads/validates the data; on each write, it writes to disk and flushes to avoid corruption (use fs/promises.writeFile with JSON.stringify).
Frontend
Stack: React + TypeScript + Tailwind (Vite).
Reads config from VITE_API_URL=http://localhost:3000/api and VITE_MFA_SECRET.
Use hooks/components to fetch from backend and display rates/admin UI.
Steps:
cd frontend
cp .env.example .env
npm install
npm run dev (opens http://localhost:8080).
JSON data
Structure example:
    {      "users": [        { "id": "uuid", "email": "", "passwordHash": "", "roles": ["admin"] }      ],      "rates": [        { "id": "uuid", "from": "USD", "to": "NPR", "rate": 133.5 }      ],      "auditLogs": []    }
Provide util functions loadData()/saveData() (with locking) and keep file under .gitignore.
Dockerized Local Run
Backend container:
Base image node:20-alpine.
Copy backend, install deps, build TypeScript, run node dist/app.js.
Mount host directory for JSON data to persist (-v ./data:/app/data).
Environment variables: JSON_DATA_PATH=/app/data, secrets.
Frontend container:
Build static assets via Vite, or use multi-stage to build and serve via Nginx.
docker-compose:
Service backend: exposes 3000, mounts ./data.
Service frontend: either Nginx hosting built files or Vite dev server proxied; set API_URL=http://backend:3000/api.
Steps:
docker-compose build
docker-compose up -d
Visit http://localhost:8080.
AWS Deployment Plan
Infrastructure
S3 bucket senate-exchange-data (private) to store JSON data for persistence.
IAM role for backend ECS task with permissions to s3:GetObject, s3:PutObject, s3:ListBucket on the bucket.
ECS Fargate service running the backend container (Node 20).
Another service (or same container) for the frontend (Nginx).
Application Load Balancer routing HTTPS to frontend container, with /api/* routed to backend target group (or use single container with Supervisord).
Secrets stored in AWS Systems Manager Parameter Store (JWT secret, MFA secret).
Backend runtime
On startup, backend downloads the JSON file from S3 (e.g., s3://senate-exchange-data/state.json) to local /tmp/data.json.
After each write, sync back to S3 (use exponential backoff).
Consider caching writes and using object versioning to avoid collisions.
Env vars: S3_BUCKET, S3_KEY, AWS_REGION, etc.
Frontend
Build static assets, upload to S3, serve via CloudFront OR keep inside same container behind Nginx.
Deployment steps
Build Docker image (docker build -t senate-app .).
Push to ECR.
Update ECS task definition referencing ECR image, SSM parameters, and IAM role.
Ensure the task has access to the S3 bucket (task execution role + inline policy).
Run migrations (N/A since JSON).
Validate health endpoints.
Let me know if you want updated project structure, sample code for JSON persistence, Dockerfiles, or IaC templates.