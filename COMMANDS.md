# Commands Reference Card

Quick reference for common Task Manager commands.

## 🚀 Getting Started

```bash
# Install all dependencies (root, client, server)
npm run install-all

# Initialize the database
npm run init-db

# Start development (server + client)
npm run dev
```

## 🔧 Development Commands

```bash
# Start server only (with hot-reload)
npm run server:dev

# Start client only (Vite dev server)
npm run client:dev

# Start specific client mode
cd client && npm run dev
cd client && npm run preview
```

## 🏗️ Building

```bash
# Build client for production
npm run client:build

# Preview production build locally
npm run client:preview
```

## 📦 Package Management

```bash
# Install dependencies in specific folder
cd server && npm install
cd client && npm install

# Check for vulnerabilities
npm audit
npm audit fix
```

## 🗄️ Database

```bash
# Initialize database
npm run init-db

# Access SQLite directly
sqlite3 server/models/dev.sqlite

# Common SQLite commands:
# .tables                 # List tables
# .schema                 # Show schema
# SELECT * FROM users;   # Query data
# .exit                  # Exit
```

## 🧪 Testing & Debugging

```bash
# Run server with debugging
node --inspect server/app.js

# Check if ports are in use (macOS/Linux)
lsof -i :4000  # Port 4000
lsof -i :3000  # Port 3000

# Kill process on port
kill -9 <PID>

# Windows equivalent
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

## 🌐 API Testing

```bash
# Register user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","name":"Test"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# Get tasks (replace TOKEN)
curl http://localhost:4000/api/tasks \
  -H "Authorization: Bearer TOKEN"

# Create task
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My Task","description":"Details"}'
```

## 🛠️ Maintenance

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Update all packages
npm update

# Check outdated packages
npm outdated
```

## 📝 Git Commands

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "feat: your message"

# Push to GitHub
git push origin main

# Create new branch
git checkout -b feature/your-feature
```

## 🚀 Deployment (Quick)

```bash
# Build client
npm run client:build

# Deploy to Vercel
vercel

# Deploy to Netlify
netlify deploy --prod --dir=client/dist

# Deploy to Heroku
heroku login
git push heroku main
```

## 🔍 Monitoring

```bash
# View server logs
npm run server:dev
# Logs appear in terminal

# View client build output
npm run client:build
# Check console for webpack/vite messages

# Monitor file changes
npm run server:dev
# Uses nodemon for auto-reload
```

## 📊 View Logs

```bash
# Server errors
npm run server:dev
# Check terminal output

# Client errors
# Check browser DevTools (F12)
# - Console tab: JavaScript errors
# - Network tab: API calls
# - Application tab: LocalStorage (JWT token)
```

## ✅ Health Check

```bash
# Test server is running
curl http://localhost:4000/api/tasks \
  -H "Authorization: Bearer test"
# Should return: 401 (invalid token) or 200 (valid token)

# Test client is running
curl http://localhost:3000
# Should return HTML

# Test database exists
ls server/models/dev.sqlite
# Should show file
```

## 🆘 Troubleshooting Commands

```bash
# Reset everything
rm -rf node_modules package-lock.json server/models/dev.sqlite
npm run install-all
npm run init-db
npm run dev

# Check Node version
node --version

# Check npm version
npm --version

# Check if ports are available
netstat -an | grep 3000
netstat -an | grep 4000

# Clear Vite cache
rm -rf client/dist
rm -rf client/.vite
```

## 📋 Checklist Before Deploying

```bash
# 1. Build client
npm run client:build

# 2. Check for errors
npm run client:build 2>&1 | grep error

# 3. Verify server starts
npm run server:start

# 4. Test main features
# - Register user
# - Login
# - Create task
# - Edit task
# - Delete task

# 5. Check security
# - Change JWT_SECRET in .env
# - Set NODE_ENV=production
# - Review .env variables
```

## 🎓 Useful Environment Variables

```bash
# server/.env
JWT_SECRET=your_secret_key
PORT=4000
NODE_ENV=development
DATABASE_FILE=./models/dev.sqlite

# client/.env (optional)
VITE_API_BASE=http://localhost:4000/api
```

## 📚 File Locations

| What | Where |
|------|-------|
| Server config | `server/.env` |
| Client build | `client/vite.config.ts` |
| Database | `server/models/dev.sqlite` |
| API routes | `server/routes/` |
| React pages | `client/src/pages/` |
| Styles | `client/src/index.css` |
| Env example | `.env.example` |

## 💬 Useful Strings to Search

```
// Find all TODO comments
grep -r "TODO" .

// Find console.logs
grep -r "console.log" server/

// Find hardcoded URLs
grep -r "localhost" .

// Find password handling
grep -r "password" server/
```

## 🔗 Useful Links

- [Task Manager Docs](./INDEX.md)
- [Quick Start](./QUICKSTART.md)
- [Full README](./README.md)
- [Developer Guide](./DEVELOPER.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

**Print this page for quick reference while developing!**

Last updated: December 10, 2025
