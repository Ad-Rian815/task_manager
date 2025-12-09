# Deployment Guide

This guide covers deploying the Task Manager application to production.

## Pre-Deployment Checklist

- [ ] Change `JWT_SECRET` in `server/.env` to a strong random string
- [ ] Set `NODE_ENV=production` in `server/.env`
- [ ] Change database from SQLite to PostgreSQL (recommended for production)
- [ ] Review and restrict CORS settings in `server/app.js`
- [ ] Add input validation (Joi, Zod) to all API routes
- [ ] Add error logging (e.g., Sentry, LogRocket)
- [ ] Test thoroughly in staging environment
- [ ] Set up automated backups for database
- [ ] Review security: SQL injection, XSS, CSRF protection

## Server Deployment

### Option 1: Heroku (Easy)

1. **Install Heroku CLI** and login:
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET=your_strong_secret
   heroku config:set NODE_ENV=production
   ```

4. **Add PostgreSQL addon (optional but recommended):**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

5. **Update `server/models/index.js`** to support PostgreSQL:
   ```javascript
   const sequelize = process.env.DATABASE_URL 
     ? new Sequelize(process.env.DATABASE_URL, { logging: false })
     : new Sequelize({ dialect: 'sqlite', storage: dbFile });
   ```

6. **Deploy:**
   ```bash
   git push heroku main
   ```

7. **View logs:**
   ```bash
   heroku logs --tail
   ```

### Option 2: DigitalOcean App Platform

1. Push your repo to GitHub
2. Connect your repo in DigitalOcean App Platform
3. Set environment variables in the dashboard
4. Deploy

### Option 3: AWS EC2 + RDS

1. **Launch EC2 instance** (Ubuntu 20.04)
2. **Connect and setup:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. **Clone repo and install:**
   ```bash
   git clone <your-repo> /opt/task-manager
   cd /opt/task-manager
   npm run install-all
   ```

4. **Create PostgreSQL RDS instance** in AWS console
5. **Update `.env`** with RDS connection string
6. **Run migrations:**
   ```bash
   npm run init-db
   ```

7. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start server/app.js --name "task-manager"
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx reverse proxy:**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     
     location /api {
       proxy_pass http://localhost:4000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
     
     location / {
       proxy_pass http://localhost:3000;
     }
   }
   ```

## Client Deployment

### Build for Production

```bash
npm run client:build
```

This creates `client/dist/` with optimized, minified assets.

### Option 1: Deploy to Vercel (Recommended for React)

1. **Connect GitHub repo to Vercel**
2. **Set build command:**
   ```
   npm run client:build
   ```
3. **Set output directory:**
   ```
   client/dist
   ```
4. **Add environment variable:**
   ```
   VITE_API_BASE=https://your-server-api.com/api
   ```
5. **Deploy** (automatic on git push)

### Option 2: Deploy to Netlify

1. **Connect GitHub repo to Netlify**
2. **Set build settings:**
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`
3. **Add environment variable:**
   ```
   VITE_API_BASE=https://your-server-api.com/api
   ```
4. **Deploy**

### Option 3: Deploy to AWS S3 + CloudFront

1. **Build client:**
   ```bash
   npm run client:build
   ```

2. **Create S3 bucket:**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

3. **Upload build:**
   ```bash
   aws s3 sync client/dist s3://your-bucket-name
   ```

4. **Create CloudFront distribution** pointing to S3 bucket
5. **Configure origin custom header** to point to API

### Option 4: Serve from Same Domain (Monolith)

Update `server/app.js`:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, '../client/dist')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

module.exports = app;
```

Then build and deploy server only—it serves both API and frontend.

## Database Migration (SQLite → PostgreSQL)

### For Heroku:

```bash
# Install pg package if not already installed
npm install pg

# Update server/models/index.js to use DATABASE_URL
# Heroku sets this automatically

# Deploy and Heroku will run migrations
```

### Manual Migration:

1. **Dump SQLite data:**
   ```bash
   sqlite3 server/models/dev.sqlite ".dump" > dump.sql
   ```

2. **Create PostgreSQL tables:**
   ```javascript
   // Update models/index.js
   const sequelize = new Sequelize(process.env.DATABASE_URL);
   ```

3. **Sync models (creates tables):**
   ```bash
   npm run init-db
   ```

4. **Migrate data** (write custom script or use tools like pgloader)

## Environment Variables for Production

```bash
# server/.env (production)
JWT_SECRET=<strong-random-string-32-chars>
PORT=4000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/dbname
# Or for SQLite:
DATABASE_FILE=/var/lib/task-manager/prod.sqlite

# client/.env (if separate deployment)
VITE_API_BASE=https://api.yourdomain.com
```

## Monitoring & Logging

### Sentry (Error Tracking)

```bash
npm install @sentry/node
```

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### ELK Stack (Logging)

Send logs to Elasticsearch for centralized monitoring.

### DataDog / New Relic

Monitor performance, uptime, and resource usage.

## SSL/TLS Certificate

Use Let's Encrypt for free HTTPS:

```bash
# On server with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

Update Nginx/Heroku to use HTTPS.

## Backup Strategy

### Database Backups

**PostgreSQL (Heroku):**
```bash
heroku pg:backups:capture
heroku pg:backups:download
```

**Manual cron job (EC2):**
```bash
# /usr/local/bin/backup-db.sh
pg_dump $DATABASE_URL > /backups/db-$(date +%Y-%m-%d).sql
```

### Application Code

Use Git for version control. GitHub/GitLab automatically provide backups.

## Scaling Considerations

1. **Stateless server** – Sessions stored in JWT tokens (already done ✅)
2. **Database caching** – Add Redis for session/query caching
3. **Load balancer** – Multiple server instances behind Nginx/ALB
4. **CDN** – CloudFront/Cloudflare for static assets
5. **Horizontal scaling** – Container orchestration (Docker + Kubernetes)

## Example Production Deploy (Full Stack)

### Using Docker + Docker Compose

```dockerfile
# Dockerfile (server)
FROM node:18-alpine
WORKDIR /app
COPY server ./server
COPY client/dist ./client/dist
WORKDIR /app/server
RUN npm install --production
EXPOSE 4000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3'
services:
  server:
    build: .
    ports:
      - "4000:4000"
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres
  
  postgres:
    image: postgres:14
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=taskmanager
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Deploy with:
```bash
docker-compose up -d
```

## Post-Deployment Testing

- [ ] Register new user
- [ ] Login with valid/invalid credentials
- [ ] Create task and verify in database
- [ ] Update task completion status
- [ ] Edit task details
- [ ] Delete task
- [ ] Filter tasks by status
- [ ] Logout and re-login
- [ ] Test on mobile browser
- [ ] Check API response times
- [ ] Monitor error logs

## Rollback Plan

Keep previous versions available:
```bash
git revert <commit-hash>
git push production main
```

Or use container image tags:
```bash
docker pull my-registry/task-manager:v1.0.1
docker-compose up
```

---

**For detailed post-deployment monitoring, refer to your hosting provider's documentation.**
