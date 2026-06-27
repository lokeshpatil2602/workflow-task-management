# 🚀 Deployment Guide — Workflow Task Management System

## Quick Start (Local Dev)

```bash
# Backend
cd server && npm install && npm start

# Frontend (new terminal)
cd client && npm install && npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000
- Login: `admin` / `admin123`

---

## Option 1: Docker Compose (Recommended)

### Prerequisites
- Docker Desktop installed
- Docker Compose v2+

### Steps

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd task-management-system-main

# 2. Create environment file
cp .env.example .env
# Edit .env with your values (DB password, JWT secret, domain)

# 3. Start everything
docker compose up -d --build

# 4. Run database migrations (first time only)
docker compose exec server node migrations/runMigration.js

# 5. Fix passwords (first time only)
docker compose exec server node migrations/fixPasswords.js
```

- App running at: http://localhost
- API at: http://localhost/api

### Stop
```bash
docker compose down
```

### View logs
```bash
docker compose logs -f server
docker compose logs -f client
```

---

## Option 2: VPS / Cloud (Ubuntu)

### Prerequisites
- Ubuntu 22.04 LTS
- Node.js 20+
- MySQL 8.0
- Nginx
- PM2

### Step 1 — Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Step 2 — Install PM2
```bash
npm install -g pm2
```

### Step 3 — Clone & Install
```bash
git clone <your-repo-url> /var/www/workflow
cd /var/www/workflow

# Install server deps
cd server && npm install --omit=dev

# Build client
cd ../client && npm install && npm run build
```

### Step 4 — Configure Environment
```bash
cd /var/www/workflow/server
cp .env.example .env
nano .env   # Fill in your values
```

### Step 5 — Run Database
```bash
mysql -u root -p
CREATE DATABASE workflow;
exit

# Run migrations
node migrations/runMigration.js
node migrations/fixPasswords.js
```

### Step 6 — Start Backend with PM2
```bash
cd /var/www/workflow
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup   # Follow the printed command to auto-start on reboot
```

### Step 7 — Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/workflow
```

Paste:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Serve React build
    root /var/www/workflow/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Proxy uploads
    location /uploads/ {
        proxy_pass http://localhost:5000;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/workflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8 — HTTPS with Certbot (optional but recommended)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Option 3: Railway / Render (PaaS)

### Backend (Render/Railway)
1. Connect GitHub repo
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add environment variables from `.env.example`

### Frontend (Vercel/Netlify)
1. Connect GitHub repo
2. Set root directory to `client`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env: `VITE_API_URL=https://your-backend-url.com`

---

## Environment Variables Reference

### Server
| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `5000` | Server port |
| `DB_HOST` | `localhost` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | MySQL username |
| `DB_PASSWORD` | `` | MySQL password |
| `DB_NAME` | `workflow` | Database name |
| `JWT_SECRET` | — | **Required** — JWT signing key |
| `BASE_URL` | `http://localhost:5000` | Server public URL |
| `CLIENT_URL` | `http://localhost:5173` | Frontend URL (for CORS) |

### Client
| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000` | Backend URL |
| `VITE_SOCKET_URL` | `http://localhost:5000` | Socket.IO URL |

---

## Default Login
| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |

**Change the admin password after first login!**
