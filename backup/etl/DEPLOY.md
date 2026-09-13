Found it! On mobile (@media (max-width: 768px)), the chat container becomes:

.chat-container {
  width: 100%;
  height: 100%;  /* ← This is the problem! */
  top: 0;
  left: 0;
  transform: none;
  border-radius: 0;
  max-width: 100%;
  max-height: 100%;
}

Copy
css
The height: 100% on mobile is causing the blank screen issue. Let's fix it:

# Edit the CSS file
nano ~/susuki_chatboat/chatboat/src/components/ChatWidget.css

Copy
bash
Find the @media (max-width: 768px) section with .chat-container and change:

.chat-container {
  width: 100%;
  height: 100vh;  /* Change from 100% to 100vh */
  ...
}

Copy
css
Or let's do it with sed:

cd ~/susuki_chatboat/chatboat

# Backup the CSS file first
cp src/components/ChatWidget.css src/components/ChatWidget.css.backup

# Fix the height issue
sed -i 's/height: 100%;/height: 100vh;/g' src/components/ChatWidget.css

# Rebuild
rm -rf dist/
npm run build

# Copy to server
sudo cp -r dist/* /var/www/suzuki-chatbot/

# Update version number to force reload
sed -i 's/v=13052026/v=13052027/g' /var/www/suzuki-chatbot/index.html

# Restart Nginx
sudo systemctl restart nginx

Copy
bash
Test on mobile now! 📱🚀

lets od it with sed nto nano

cd ~/susuki_chatboat/chatboat

# Backup the CSS file first
cp src/components/ChatWidget.css src/components/ChatWidget.css.backup

# Fix the mobile height issue - target only the media query section
sed -i '/@media (max-width: 768px)/,/@media (max-width: 360px)/{s/    height: 100%;/    height: 100vh;/}' src/components/ChatWidget.css

# Verify the change
grep -A 15 "@media (max-width: 768px)" src/components/ChatWidget.css | grep "height:"

# Rebuild
rm -rf dist/
npm run build

# Copy to server
sudo cp -r dist/* /var/www/suzuki-chatbot/

# Update version number to force reload
sed -i 's/v=13052026/v=13052027/g' /var/www/suzuki-chatbot/index.html

# Restart Nginx
sudo systemctl restart nginx

Copy
Now test on mobile! Close browser completely and reopen: http://5.199.136.2:3000 📱🚀

mohamed@vps2616595:/susuki_chatboat/chatboat$ ls
README.md node_modules package.json src
dist package-lock.json public webpack.config.js
mohamed@vps2616595:/susuki_chatboat/chatboat$ cd src
mohamed@vps2616595:/susuki_chatboat/chatboat/src$ ls
App.jsx components config.js index.js
mohamed@vps2616595:/susuki_chatboat/chatboat/src$ cd compoenents
-bash: cd: compoenents: No such file or directory
mohamed@vps2616595:/susuki_chatboat/chatboat/src$ ls
App.jsx components config.js index.js
mohamed@vps2616595:/susuki_chatboat/chatboat/src$ sed -i '/@media (max-width: 768px)/,/@media (max-width: 360px)/{s/ height: 100%;/ height: 100vh;/}' src/components/ChatWidget.css
sed: can't read src/components/ChatWidget.css: No such file or directory
mohamed@vps2616595:~/susuki_chatboat/chatboat/src$

You're in the src directory, go back up:

cd ~/susuki_chatboat/chatboat

# Now run the commands
cp src/components/ChatWidget.css src/components/ChatWidget.css.backup

# Fix the mobile height issue
sed -i '/@media (max-width: 768px)/,/@media (max-width: 360px)/{s/    height: 100%;/    height: 100vh;/}' src/components/ChatWidget.css

# Verify the change
grep -A 15 "@media (max-width: 768px)" src/components/ChatWidget.css | grep "height:"

# Rebuild
rm -rf dist/
npm run build

# Copy to server
sudo cp -r dist/* /var/www/suzuki-chatbot/

# Update version number to force reload
sed -i 's/v=13052026/v=13052027/g' /var/www/suzuki-chatbot/index.html

# Restart Nginx
sudo systemctl restart nginx

Copy
bash
Run these commands! 🚀

D:\house_md\Suzuki\chatboat\src\components\ChatWidget.jsx
do it n her ei ll copit yt via win csp


Context
1 file read
ChatWidget.css
Fix mobile blank screen issue by changing height from 100% to 100vh

ChatWidget.css
+1
-1

Undo
Perfect! Now upload the fixed file to the server using WinSCP, then on the server:

cd ~/susuki_chatboat/chatboat

# Rebuild
rm -rf dist/
npm run build

# Copy to server
sudo cp -r dist/* /var/www/suzuki-chatbot/

# Update version to force reload
sed -i 's/v=13052027/v=13052028/g' /var/www/suzuki-chatbot/index.html

# Restart Nginx
sudo systemctl restart nginx

Copy
After uploading the CSS file via WinSCP, run these commands on the server! 📱🚀

mohamed@vps2616595:/susuki_chatboat/chatboat/src$ sed -i '/@media (max-width: 768px)/,/@media (max-width: 360px)/{s/ height: 100%;/ height: 100vh;/}' src/components/ChatWidget.css
sed: can't read src/components/ChatWidget.css: No such file or directory
mohamed@vps2616595:/susuki_chatboat/chatboat/src$ cd ..
mohamed@vps2616595:/susuki_chatboat/chatboat$ rm -rf dist/
mohamed@vps2616595:/susuki_chatboat/chatboat$ npm run build

> build
> webpack --mode production

[baseline-browser-mapping] The data in this module is over two months old. To ensure accurate Baseline data, please update: npm i baseline-browser-mapping@latest -D
asset widget.js 195 KiB [emitted] [minimized] (name: main) 1 related asset
asset suzuli_logo.png 25.9 KiB [emitted] [from: public/suzuli_logo.png] [copied]
asset index.html 504 bytes [emitted]
orphan modules 3.07 MiB [orphan] 11 modules
runtime modules 972 bytes 5 modules
cacheable modules 3.25 MiB
modules by path ./node_modules/ 150 KiB
modules by path ./node_modules/style-loader/dist/runtime/.js 5.84 KiB 6 modules
modules by path ./node_modules/react-dom/ 131 KiB 3 modules
modules by path ./node_modules/react/ 6.95 KiB 2 modules
modules by path ./node_modules/scheduler/ 4.33 KiB 2 modules
modules by path ./node_modules/css-loader/dist/runtime/.js 2.31 KiB 2 modules
modules by path ./src/ 3.1 MiB
./src/index.js + 11 modules 3.07 MiB [built] [code generated]
./node_modules/css-loader/dist/cjs.js!./src/components/ChatWidget.css 26.1 KiB [built] [code generated]
webpack 5.103.0 compiled successfully in 14854 ms
mohamed@vps2616595:/susuki_chatboat/chatboat$ sudo cp -r dist/* /var/www/suzuki-chatbot/
mohamed@vps2616595:/susuki_chatboat/chatboat$

Perfect! Now update the version and restart Nginx:

# Update version to force reload
sed -i 's/v=13052027/v=13052028/g' /var/www/suzuki-chatbot/index.html

# Verify the change
cat /var/www/suzuki-chatbot/index.html | grep widget

# Restart Nginx
sudo systemctl restart nginx

Copy
Now test on your phone:

Close browser completely (swipe away from recent apps)

Reopen browser

Go to: http://5.199.136.2:3000

Upload carte grise

Try typing a message

The blank screen should be fixed now! 📱✅

mohamed@vps2616595:/susuki_chatboat/chatboat$ sed -i 's/v=13052027/v=13052028/g' /var/www/suzuki-chatbot/index.html
sed: couldn't open temporary file /var/www/suzuki-chatbot/sed5alTTl: Permission denied
mohamed@vps2616595:/susuki_chatboat/chatboat$ sudo sed -i 's/v=13052027/v=13052028/g' /var/www/suzuki-chatbot/index.html
mohamed@vps2616595:/susuki_chatboat/chatboat$ cat /var/www/suzuki-chatbot/index.html | grep widget
<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Suzuki Chatbot</title><link rel="preconnect" href="https://fonts.googleapis.com&quot;&gt;&lt;link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"><script defer="defer" src="/widget.js"></script></head><body><div id="suzuki-chatbot-root"></div></body></html>
mohamed@vps2616595:/susuki_chatboat/chatboat$ sudo systemctl restart nginx
mohamed@vps2616595:~/susuki_chatboat/chatboat$

I see the version parameter was removed during the rebuild. Let's add it back:

# Add version parameter to force reload
sudo sed -i 's|src="/widget.js"|src="/widget.js?v=13052028"|g' /var/www/suzuki-chatbot/index.html

# Verify
cat /var/www/suzuki-chatbot/index.html | grep widget

# Restart Nginx
sudo systemctl restart nginx

Copy
Now test on your phone! 📱🚀

mohamed@vps2616595:/susuki_chatboat/chatboat$ sed -i 's/v=13052027/v=13052028/g' /var/www/suzuki-chatbot/index.html
sed: couldn't open temporary file /var/www/suzuki-chatbot/sed5alTTl: Permission denied
mohamed@vps2616595:/susuki_chatboat/chatboat$ sudo sed -i 's/v=13052027/v=13052028/g' /var/www/suzuki-chatbot/index.html
mohamed@vps2616595:/susuki_chatboat/chatboat$ cat /var/www/suzuki-chatbot/index.html | grep widget
<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Suzuki Chatbot</title><link rel="preconnect" href="https://fonts.googleapis.com&quot;&gt;&lt;link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"><script defer="defer" src="/widget.js"></script></head><body><div id="suzuki-chatbot-root"></div></body></html>
mohamed@vps2616595:/susuki_chatboat/chatboat$ sudo systemctl restart nginx
mohamed@vps2616595:/susuki_chatboat/chatboat$ ^C
mohamed@vps2616595:/susuki_chatboat/chatboat$ sudo sed -i 's|src="/widget.js"|src="/widget.js?v=13052028"|g' /var/www/suzuki-chatbot/index.html
mohamed@vps2616595:/susuki_chatboat/chatboat$ cat /var/www/suzuki-chatbot/index.html | grep widget
<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Suzuki Chatbot</title><link rel="preconnect" href="https://fonts.googleapis.com&quot;&gt;&lt;link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"><script defer="defer" src="/widget.js?v=13052028"></script></head><body><div id="suzuki-chatbot-root"></div></body></html>
mohamed@vps2616595:/susuki_chatboat/chatboat$ sudo systemctl restart nginx
mohamed@vps2616595:~/susuki_chatboat/chatboat$

Perfect! ✅ Now test on your phone:

Close browser completely (swipe away from recent apps)

Reopen browser

Go to: http://5.199.136.2:3000

Upload carte grise

Try typing a message

The height: 100vh fix should resolve the blank screen issue on mobile! 📱🚀

Let me know if it works now!

perfect nwo to we not forget htis putt all the compand and version paramtere in mad fiel

Great idea! Let's create a deployment script with all the commands:

# Create deployment script
nano ~/susuki_chatboat/DEPLOY.md

Copy
Paste this:

# 🚀 Suzuki Chatbot Deployment Guide

## 📋 Server Information
- **Server IP:** 5.199.136.2
- **Frontend URL:** http://5.199.136.2:3000
- **Backend URL:** http://5.199.136.2:8000
- **Backend Port:** 8000
- **Frontend Port:** 3000 (via Nginx)

## 🗄️ Database
- **Name:** suzuki_parts
- **Host:** localhost:5432
- **User:** postgres
- **Password:** 23044943

## 📂 Directory Structure

Copy
markdown
~/susuki_chatboat/
├── chatboat/ # Frontend (React)
├── suzuki-backend/ # Backend (NestJS)
└── DEPLOY.md # This file


## 🔧 Backend Deployment

### 1. Navigate to Backend
```bash
cd ~/susuki_chatboat/suzuki-backend

Copy
2. Update Code (if needed)
git pull origin main
npm install

Copy
bash
3. Build Backend
npm run build

Copy
bash
4. Restart Backend with PM2
pm2 restart suzuki-backend
pm2 save

Copy
bash
5. Check Backend Status
pm2 list
pm2 logs suzuki-backend --lines 50
curl http://localhost:8000/health

Copy
bash
🎨 Frontend Deployment
1. Navigate to Frontend
cd ~/susuki_chatboat/chatboat

Copy
bash
2. Update .env (if needed)
cat .env
# Should contain:
# REACT_APP_API_URL=http://5.199.136.2:8000
# NODE_ENV=production
# PORT=3000

Copy
bash
3. Update src/config.js (if needed)
cat src/config.js
# Should have fallback:
# apiUrl: process.env.REACT_APP_API_URL || 'http://5.199.136.2:8000'

Copy
bash
4. Clean and Build
rm -rf dist/
npm run build

Copy
bash
5. Copy to Web Directory
sudo cp -r dist/* /var/www/suzuki-chatbot/

Copy
bash
6. Update Version Parameter (IMPORTANT!)
# Increment version number each deployment
CURRENT_VERSION=$(date +%d%m%Y%H%M)
sudo sed -i "s|src=\"/widget.js?v=[^\"]*\"|src=\"/widget.js?v=$CURRENT_VERSION\"|g" /var/www/suzuki-chatbot/index.html

# Or manually:
sudo sed -i 's|src="/widget.js?v=13052028"|src="/widget.js?v=NEW_VERSION"|g' /var/www/suzuki-chatbot/index.html

Copy
bash
7. Verify and Restart Nginx
cat /var/www/suzuki-chatbot/index.html | grep widget
sudo nginx -t
sudo systemctl restart nginx

Copy
bash
🔄 Quick Deployment Script
Full Deployment (Backend + Frontend)
#!/bin/bash
echo "🚀 Starting Suzuki Chatbot Deployment..."

# Backend
echo "📦 Building Backend..."
cd ~/susuki_chatboat/suzuki-backend
npm run build
pm2 restart suzuki-backend
pm2 save

# Frontend
echo "🎨 Building Frontend..."
cd ~/susuki_chatboat/chatboat
rm -rf dist/
npm run build
sudo cp -r dist/* /var/www/suzuki-chatbot/

# Update version
VERSION=$(date +%d%m%Y%H%M)
sudo sed -i "s|src=\"/widget.js?v=[^\"]*\"|src=\"/widget.js?v=$VERSION\"|g" /var/www/suzuki-chatbot/index.html

# Restart Nginx
sudo systemctl restart nginx

echo "✅ Deployment Complete!"
echo "Frontend: http://5.199.136.2:3000"
echo "Backend: http://5.199.136.2:8000/health"


Copy
bash
Save as: ~/susuki_chatboat/deploy.sh

Make executable:

chmod +x ~/susuki_chatboat/deploy.sh

Copy
bash
Run:

~/susuki_chatboat/deploy.sh

Copy
bash
🗄️ Database Management
Reset Upload Limits
cd ~/susuki_chatboat/suzuki-backend
node reset-upload-limit.js

Copy
bash
Backup Database
pg_dump -U postgres -d suzuki_parts -F c -f ~/suzuki_backup_$(date +%Y%m%d).dump

Copy
bash
Restore Database
pg_restore -U postgres -d suzuki_parts -v ~/suzuki_backup_YYYYMMDD.dump

Copy
bash
📊 Monitoring
Check PM2 Processes
pm2 list
pm2 info suzuki-backend
pm2 logs suzuki-backend --lines 100

Copy
bash
Check Nginx
sudo systemctl status nginx
sudo nginx -t
cat /etc/nginx/sites-available/suzuki-chatbot

Copy
bash
Check Ports
sudo ss -tulpn | grep -E ':3000|:8000'

Copy
bash
🐛 Troubleshooting
Frontend shows localhost:8000
Problem: Browser cache
Solution:

Update version parameter in index.html

Clear browser cache completely

Use incognito mode

Try different browser

Backend not responding
pm2 restart suzuki-backend
pm2 logs suzuki-backend --lines 100

Copy
bash
Nginx not serving files
sudo systemctl restart nginx
ls -la /var/www/suzuki-chatbot/

Copy
bash
Database connection error
sudo systemctl status postgresql
sudo -u postgres psql -d suzuki_parts -c "SELECT COUNT(*) FROM parts;"

Copy
bash
📝 Environment Variables
Backend (.env)
DATABASE_URL="postgresql://postgres:23044943@localhost:5432/suzuki_parts?schema=public"
OPENAI_API_KEY="sk-proj-..."
GEMINI_API_KEY="AIzaSy..."
PORT=8000
NODE_ENV=production
CORS_ORIGINS="http://5.199.136.2:3000,http://localhost:3000,https://carpro.tn"
MAX_FILE_SIZE=26214400
UPLOAD_DIR="./uploads"

Copy
env
Frontend (.env)
REACT_APP_API_URL=http://5.199.136.2:8000
NODE_ENV=production
PORT=3000

Copy
env
🔐 Important Notes
Always increment version parameter when deploying frontend

Test in incognito mode after deployment

Check PM2 logs for backend errors

Backup database before major changes

Keep .env files secure - never commit to git

📞 Support
Backend logs: pm2 logs suzuki-backend

Nginx logs: sudo tail -f /var/log/nginx/error.log

Database: sudo -u postgres psql -d suzuki_parts


Save and exit (`Ctrl+X`, `Y`, `Enter`)

Now create the deployment script:

```bash
nano ~/susuki_chatboat/deploy.sh

Copy
Paste this:

#!/bin/bash
echo "🚀 Starting Suzuki Chatbot Deployment..."

# Backend
echo "📦 Building Backend..."
cd ~/susuki_chatboat/suzuki-backend
npm run build
pm2 restart suzuki-backend
pm2 save

# Frontend
echo "🎨 Building Frontend..."
cd ~/susuki_chatboat/chatboat
rm -rf dist/
npm run build
sudo cp -r dist/* /var/www/suzuki-chatbot/

# Update version with timestamp
VERSION=$(date +%d%m%Y%H%M)
echo "📝 Updating version to: $VERSION"
sudo sed -i "s|src=\"/widget.js?v=[^\"]*\"|src=\"/widget.js?v=$VERSION\"|g" /var/www/suzuki-chatbot/index.html

# Restart Nginx
echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

echo ""
echo "✅ Deployment Complete!"
echo "📱 Frontend: http://5.199.136.2:3000"
echo "🔧 Backend: http://5.199.136.2:8000/health"
echo "📊 Version: $VERSION"


Copy
bash
Make it executable:

chmod +x ~/susuki_chatboat/deploy.sh

Copy
bash
Now you can deploy with one command:

~/susuki_chatboat/deploy.sh

Copy
bash
Done! 🎉
***************************************************
mohamed@vps2616595:~/susuki_chatboat$ grep -B 10 "setIsVerified(true)" ~/susuki_chatboat/chatboat/src/components/ChatWidget.jsx | grep "setIsOpen"
mohamed@vps2616595:~/susuki_chatboat$ sed -i '/setIsVerified(true);/i\          setIsOpen(true);' src/components/ChatWidget.jsx
sed: can't read src/components/ChatWidget.jsx: No such file or directory
mohamed@vps2616595:~/susuki_chatboat$ cd ~/susuki_chatboat/chatboat
mohamed@vps2616595:~/susuki_chatboat/chatboat$ sed -i '/setIsVerified(true);/i\
> ^C
mohamed@vps2616595:~/susuki_chatboat/chatboat$ ^C
mohamed@vps2616595:~/susuki_chatboat/chatboat$ sed -i 's/setIsVerified(true);/setIsOpen(true);\n          setIsVerified(true);/' src/components/ChatWidget.jsx
mohamed@vps2616595:~/susuki_chatboat/chatboat$ grep -B 2 -A 2 "setIsVerified(true)" src/components/ChatWidget.jsx | head -10
        const tid = setTimeout(() => {
          setIsOpen(true);
          setIsVerified(true);
          setMessages((prev) => [
            ...prev,
--
              setShowVehicleCard(false);
              setIsOpen(true);
          setIsVerified(true);
              // Add welcome message with vehicle info
mohamed@vps2616595:~/susuki_chatboat/chatboat$ rm -rf dist/
mohamed@vps2616595:~/susuki_chatboat/chatboat$ npm run build

> suzuki-chatbot@1.0.0 build
> webpack --mode production

[baseline-browser-mapping] The data in this module is over two months old.  To ensure accurate Baseline data, please update: `npm i baseline-browser-mapping@latest -D`
asset widget.js 195 KiB [emitted] [minimized] (name: main) 1 related asset
asset suzuli_logo.png 25.9 KiB [emitted] [from: public/suzuli_logo.png] [copied]
asset index.html 504 bytes [emitted]
orphan modules 3.07 MiB [orphan] 11 modules
runtime modules 972 bytes 5 modules
cacheable modules 3.25 MiB
  modules by path ./node_modules/ 150 KiB
    modules by path ./node_modules/style-loader/dist/runtime/*.js 5.84 KiB 6 modules
    modules by path ./node_modules/react-dom/ 131 KiB 3 modules
    modules by path ./node_modules/react/ 6.95 KiB 2 modules
    modules by path ./node_modules/scheduler/ 4.33 KiB 2 modules
    modules by path ./node_modules/css-loader/dist/runtime/*.js 2.31 KiB 2 modules
  modules by path ./src/ 3.1 MiB
    ./src/index.js + 11 modules 3.07 MiB [built] [code generated]
    ./node_modules/css-loader/dist/cjs.js!./src/components/ChatWidget.css 26.1 KiB [built] [code generated]
webpack 5.103.0 compiled successfully in 15964 ms
mohamed@vps2616595:~/susuki_chatboat/chatboat$ sudo cp -r dist/* /var/www/suzuki-chatbot/
mohamed@vps2616595:~/susuki_chatboat/chatboat$ sudo sed -i "s|src=\"/widget.js?v=[^\"]*\"|src=\"/widget.js?v=$VERSION\"|g" /var/www/suzuki-chatbot/index.html
mohamed@vps2616595:~/susuki_chatboat/chatboat$ sudo systemctl restart nginx
mohamed@vps2616595:~/susuki_chatboat/chatboat$ echo "Version: $VERSION"
Version:
mohamed@vps2616595:~/susuki_chatboat/chatboat$


mohamed@vps2616595:~/susuki_chatboat/chatboat$ sudo sed -i "s|src=\"/widget.js?v=[^\"]*\"|src=\"/widget.js?v=$VERSION\"|g" /var/www/suzuki-chatbot/index.html
mohamed@vps2616595:~/susuki_chatboat/chatboat$ cat /var/www/suzuki-chatbot/index.html | grep widget
<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Suzuki Chatbot</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><script defer="defer" src="/widget.js"></script></head><body><div id="suzuki-chatbot-root"></div></body></html>
mohamed@vps2616595:~/susuki_chatboat/chatboat$ echo "Version: $VERSION"
Version:
mohamed@vps2616595:~/susuki_chatboat/chatboat$ VERSION=$(date +%d%m%Y%H%M)
mohamed@vps2616595:~/susuki_chatboat/chatboat$ sudo sed -i "s|src=\"/widget.js?v=[^\"]*\"|src=\"/widget.js?v=$VERSION\"|g" /var/www/suzuki-chatbot/index.html
mohamed@vps2616595:~/susuki_chatboat/chatboat$ cat /var/www/suzuki-chatbot/index.html | grep widget
<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Suzuki Chatbot</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><script defer="defer" src="/widget.js"></script></head><body><div id="suzuki-chatbot-root"></div></body></html>
mohamed@vps2616595:~/susuki_chatboat/chatboat$ echo "Version: $VERSION"
Version: 130520261340
mohamed@vps2616595:~/susuki_chatboat/chatboat$

mohamed@vps2616595:~/susuki_chatboat/chatboat$ sudo sed -i 's|src="/widget.js"|src="/widget.js?v=130520261340"|g' /var/www/suzuki-chatbot/index.html
mohamed@vps2616595:~/susuki_chatboat/chatboat$ cat /var/www/suzuki-chatbot/index.html | grep widget
<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Suzuki Chatbot</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><script defer="defer" src="/widget.js?v=130520261340"></script></head><body><div id="suzuki-chatbot-root"></div></body></html>
mohamed@vps2616595:~/susuki_chatboat/chatboat$ sudo systemctl restart nginx
mohamed@vps2616595:~/susuki_chatboat/chatboat$

