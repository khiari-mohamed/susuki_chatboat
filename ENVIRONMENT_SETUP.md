# 🔧 Environment Configuration Guide

## Quick Setup

### 1. Backend Setup

```bash
cd suzuki-backend

# Copy environment template
cp .env.example .env

# Edit .env with your values
# Required:
# - DATABASE_URL
# - OPENAI_API_KEY
# - GEMINI_API_KEY

# Install dependencies
npm install

# Run database migrations
npx prisma migrate deploy

# Start backend
npm run start:dev
```

### 2. Frontend Setup

```bash
cd chatboat

# Copy environment template
cp .env.example .env

# Edit .env (default is correct for local dev)
# REACT_APP_API_URL=http://localhost:8000

# Install dependencies
npm install

# Start frontend
npm start
```

---

## Environment Variables

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | - | PostgreSQL connection string |
| `OPENAI_API_KEY` | ✅ Yes | - | OpenAI API key for GPT-4o-mini |
| `GEMINI_API_KEY` | ✅ Yes | - | Google Gemini API key for OCR |
| `PORT` | ❌ No | 8000 | Backend server port |
| `NODE_ENV` | ❌ No | development | Environment (development/production) |
| `FRONTEND_URL` | ❌ No | http://localhost:3000 | Frontend URL for CORS |
| `LEARNING_INTERVAL_MS` | ❌ No | 21600000 | Learning cycle interval (6 hours) |

### Frontend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_API_URL` | ❌ No | http://localhost:8000 | Backend API URL |

---

## Development Environment

### Backend
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/suzuki_parts?schema=public"
OPENAI_API_KEY="sk-proj-your-key-here"
GEMINI_API_KEY="your-gemini-key-here"
PORT=8000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:8000
```

### URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Endpoints**: http://localhost:8000/chat/message, /verification/upload, etc.

---

## Production Environment

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@production-db:5432/suzuki_parts?schema=public"
OPENAI_API_KEY="sk-proj-production-key"
GEMINI_API_KEY="production-gemini-key"
PORT=8000
NODE_ENV=production
FRONTEND_URL="https://suzuki.tn"
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://api.suzuki.tn
```

### URLs
- **Frontend**: https://suzuki.tn
- **Backend**: https://api.suzuki.tn
- **API Endpoints**: https://api.suzuki.tn/chat/message, /verification/upload, etc.

---

## Troubleshooting

### ❌ "ERR_CONNECTION_REFUSED"

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Check backend is running: `npm run start:dev` in `suzuki-backend/`
2. Verify backend port: Should see "🚀 Backend running on port 8000"
3. Check frontend .env: `REACT_APP_API_URL=http://localhost:8000`
4. Clear browser cache: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
5. Restart frontend: Stop (Ctrl+C) and `npm start`

### ❌ "CORS Error"

**Problem**: CORS policy blocking requests

**Solutions**:
1. Check backend .env: `FRONTEND_URL="http://localhost:3000"`
2. Verify backend logs show: "📡 CORS enabled for: http://localhost:3000"
3. Restart backend after changing .env
4. Check browser console for exact origin being blocked

### ❌ "API Key Invalid"

**Problem**: OpenAI or Gemini API key not working

**Solutions**:
1. Verify keys in backend .env
2. Check keys are not expired
3. Ensure no extra spaces or quotes in .env file
4. Restart backend after updating keys

### ❌ "Database Connection Failed"

**Problem**: Can't connect to PostgreSQL

**Solutions**:
1. Check PostgreSQL is running
2. Verify DATABASE_URL in backend .env
3. Test connection: `npx prisma db pull`
4. Check database exists: `psql -U postgres -l`

---

## Testing Configuration

### Test Backend Connection
```bash
# From any terminal
curl http://localhost:8000/chat/message -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

### Test Frontend Config
```javascript
// Open browser console (F12) on http://localhost:3000
console.log('API URL:', process.env.REACT_APP_API_URL);
```

### Test CORS
```bash
# Should return 200 OK
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:8000/chat/message -v
```

---

## Build for Production

### Backend
```bash
cd suzuki-backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd chatboat

# Set production API URL
export REACT_APP_API_URL=https://api.suzuki.tn

# Build
npm run build

# Output: dist/widget.js (ready for deployment)
```

---

## Environment Checklist

### Before Starting Development
- [ ] PostgreSQL installed and running
- [ ] Backend .env created with all required keys
- [ ] Frontend .env created
- [ ] Dependencies installed (npm install in both folders)
- [ ] Database migrated (npx prisma migrate deploy)

### Before Deploying to Production
- [ ] Production database created
- [ ] Production API keys obtained
- [ ] Backend .env updated with production values
- [ ] Frontend .env updated with production API URL
- [ ] CORS configured for production domain
- [ ] SSL certificates configured
- [ ] Environment variables set on hosting platform

---

## Quick Reference

### Start Development
```bash
# Terminal 1 - Backend
cd suzuki-backend
npm run start:dev

# Terminal 2 - Frontend
cd chatboat
npm start
```

### Stop Development
```bash
# In each terminal
Ctrl + C
```

### Restart After Config Changes
```bash
# Backend - Always restart after .env changes
Ctrl + C
npm run start:dev

# Frontend - Restart after .env changes
Ctrl + C
npm start
```

---

**Last Updated**: January 2025
**Status**: ✅ Production Ready
