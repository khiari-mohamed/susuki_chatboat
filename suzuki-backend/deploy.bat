@echo off
REM 🚀 Quick Deployment Script for Suzuki Backend (Windows)
REM Run this on your LOCAL machine to prepare deployment

echo 🚀 Suzuki Backend - Deployment Preparation
echo ==========================================

REM Step 1: Build the project
echo.
echo 📦 Step 1: Building project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Fix errors and try again.
    exit /b 1
)

echo ✅ Build successful!

REM Step 2: Create logs directory
echo.
echo 📦 Step 2: Creating deployment structure...
if not exist logs mkdir logs

REM Step 3: Show manual packaging instructions
echo.
echo ==========================================
echo ✅ BUILD COMPLETE!
echo ==========================================
echo.
echo 📋 Next Steps:
echo.
echo 1. Create a ZIP file with these folders/files:
echo    - dist/
echo    - package.json
echo    - package-lock.json
echo    - ecosystem.config.js
echo    - .env.production
echo    - prisma/
echo    - DEPLOYMENT.md
echo.
echo 2. Upload ZIP to your server
echo.
echo 3. On server, extract and run:
echo    npm install --production
echo    mv .env.production .env
echo    nano .env  (update DATABASE_URL and FRONTEND_URL)
echo    npx prisma generate
echo    pm2 start ecosystem.config.js
echo.
echo 📖 Full guide: See DEPLOYMENT.md
echo.
pause
