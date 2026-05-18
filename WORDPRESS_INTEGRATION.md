# Full Production Integration Plan — WordPress + Chatbot

## The Architecture (understand this first)

```
Client's Server
├── Nginx
│   ├── WordPress (existing, port 80/443)
│   ├── widget.js served at → https://theirdomain.com/chatbot/widget.js
│   └── /api/* reverse proxy → NestJS :8000
├── NestJS Backend (:8000, via PM2)
└── PostgreSQL (new DB on their existing PG or fresh install)

WordPress site just gets ONE line added:
<script src="https://theirdomain.com/chatbot/widget.js"></script>
```

---

## Access You Need Before You Go

Call them today and ask for:

```
1. SSH access      → IP, port, username, password or .pem key
2. Server OS       → Ubuntu version (run: lsb_release -a)
3. WordPress admin → wp-admin login (to paste the script tag)
4. Domain + SSL    → their domain, and whether SSL cert exists
5. PostgreSQL      → is it already installed? credentials if yes
6. Nginx or Apache → which web server they use (run: nginx -v or apache2 -v)
```

---

## Day-Of Execution Plan (step by step)

---

### PHASE 1 — Server Audit (15 min)

SSH in and run this entire block first:

```bash
# Check OS
lsb_release -a

# Check what's running
sudo systemctl list-units --type=service --state=running | grep -E "nginx|apache|postgres|mysql|node|pm2"

# Check Node.js
node -v    # need v18+
npm -v

# Check PostgreSQL
psql --version
sudo -u postgres psql -c "\l"   # list existing databases

# Check Nginx
nginx -v
cat /etc/nginx/nginx.conf | grep "include"

# Check disk space (need at least 2GB free)
df -h

# Check RAM
free -h

# Check if ports are free
sudo ss -tulpn | grep -E ':8000|:3000|:5432'

# Check PM2
pm2 --version
```

Based on what's missing, install:

```bash
# If Node.js missing or old:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# If PM2 missing:
sudo npm install -g pm2

# If PostgreSQL missing:
sudo apt install postgresql postgresql-contrib -y
sudo systemctl enable postgresql
sudo systemctl start postgresql

# If Nginx missing (unlikely if WP is running, but just in case):
sudo apt install nginx -y
```

---

### PHASE 2 — Transfer Your Project (20 min)

**Option A — via Git (cleanest):**
```bash
# On their server
cd /var/www
sudo mkdir suzuki-chatbot
sudo chown $USER:$USER suzuki-chatbot
cd suzuki-chatbot
git clone https://github.com/YOURREPO/suzuki-backend.git
git clone https://github.com/YOURREPO/suzuki-chatbot-widget.git
```

**Option B — via SCP from your machine (if no git):**
```bash
# Run this from YOUR machine
scp -r ~/susuki_chatboat/suzuki-backend user@CLIENTIP:/var/www/suzuki-chatbot/
scp -r ~/susuki_chatboat/chatboat user@CLIENTIP:/var/www/suzuki-chatbot/
```

**Option C — via WinSCP** (drag and drop both folders to `/var/www/suzuki-chatbot/`)

---

### PHASE 3 — PostgreSQL Setup (20 min)

```bash
# Create DB and user
sudo -u postgres psql << 'EOF'
CREATE USER suzuki_user WITH PASSWORD 'STRONG_PASSWORD_HERE';
CREATE DATABASE suzuki_parts OWNER suzuki_user;
GRANT ALL PRIVILEGES ON DATABASE suzuki_parts TO suzuki_user;
\q
EOF

# Verify
sudo -u postgres psql -d suzuki_parts -c "\dt"
```

Now set up the backend `.env`:

```bash
cd /var/www/suzuki-chatbot/suzuki-backend
nano .env
```

Paste this (fill in real values):

```env
DATABASE_URL="postgresql://suzuki_user:STRONG_PASSWORD_HERE@localhost:5432/suzuki_parts?schema=public"
OPENAI_API_KEY="sk-proj-..."
GEMINI_API_KEY="AIzaSy..."
PORT=8000
NODE_ENV=production
CORS_ORIGINS="https://theirdomain.com,https://www.theirdomain.com"
MAX_FILE_SIZE=26214400
UPLOAD_DIR="./uploads"
```

**Critical — CORS_ORIGINS must be their WordPress domain exactly, no trailing slash.**

---

### PHASE 4 — Backend Deployment (20 min)

```bash
cd /var/www/suzuki-chatbot/suzuki-backend

# Install dependencies
npm install

# Run Prisma migrations (creates all tables)
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Build NestJS
npm run build

# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Start with PM2
pm2 start dist/main.js --name suzuki-backend
pm2 save
pm2 startup   # run the command it outputs to survive reboots

# Verify it's running
pm2 logs suzuki-backend --lines 20
curl http://localhost:8000/health
```

---

### PHASE 5 — Import Your Database (15 min)

You have two options:

**Option A — dump from your test server, restore here:**
```bash
# On YOUR test server (5.199.136.2), run:
pg_dump -U postgres -d suzuki_parts -F c -f ~/suzuki_prod_backup.dump

# Transfer dump to client server:
scp ~/suzuki_prod_backup.dump user@CLIENTIP:/var/www/suzuki-chatbot/

# On CLIENT server, restore:
pg_restore -U suzuki_user -d suzuki_parts -v /var/www/suzuki-chatbot/suzuki_prod_backup.dump
```

**Option B — re-run your import scripts if you have them:**
```bash
cd /var/www/suzuki-chatbot/suzuki-backend
node scripts/import-parts.js      # whatever your import script is called
node scripts/import-stock.js
node scripts/import-fitment.js
```

Verify data landed:
```bash
sudo -u postgres psql -d suzuki_parts -c "SELECT COUNT(*) FROM parts;"
sudo -u postgres psql -d suzuki_parts -c "SELECT COUNT(*) FROM stock;"
sudo -u postgres psql -d suzuki_parts -c "SELECT COUNT(*) FROM fitment;"
```

---

### PHASE 6 — Frontend Widget Build (15 min)

```bash
cd /var/www/suzuki-chatbot/chatboat

# Create production .env
cat > .env << 'EOF'
REACT_APP_API_URL=https://theirdomain.com/api
NODE_ENV=production
EOF

# Install and build
npm install
npm run build

# Create the directory Nginx will serve from
sudo mkdir -p /var/www/suzuki-widget
sudo cp -r dist/* /var/www/suzuki-widget/

# Add version param
VERSION=$(date +%d%m%Y%H%M)
sudo sed -i "s|src=\"/widget.js\"|src=\"/widget.js?v=$VERSION\"|g" /var/www/suzuki-widget/index.html

ls -lh /var/www/suzuki-widget/
```

---

### PHASE 7 — Nginx Configuration (20 min)

This is the most important part. You need to find how WordPress is currently served and **add to it**, not replace it.

```bash
# Find their current Nginx config
ls /etc/nginx/sites-available/
cat /etc/nginx/sites-available/default    # or whatever their site file is called
```

You need to **add these two location blocks** inside their existing WordPress `server {}` block:

```bash
sudo nano /etc/nginx/sites-available/default    # or their site file
```

Find the existing WordPress `server` block and add inside it:

```nginx
server {
    # ... their existing WordPress config stays untouched ...

    # ─── ADD THESE TWO BLOCKS ───────────────────────────────────────

    # Serve the chatbot widget files
    location /chatbot/ {
        alias /var/www/suzuki-widget/;
        try_files $uri $uri/ =404;
        expires 1h;
        add_header Cache-Control "public, no-transform";
        add_header Access-Control-Allow-Origin "*";
    }

    # Proxy API calls to NestJS backend
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        client_max_body_size 30M;
    }

    # ────────────────────────────────────────────────────────────────
}
```

Test and restart:
```bash
sudo nginx -t          # must say "syntax is ok"
sudo systemctl reload nginx
```

Verify both work:
```bash
curl https://theirdomain.com/api/health
curl -I https://theirdomain.com/chatbot/widget.js
```

---

### PHASE 8 — WordPress Integration (10 min)

**This is the only WordPress-specific step — one line of code.**

Log into WordPress admin → **Appearance → Theme Editor → functions.php** (or use a plugin like "Insert Headers and Footers"):

```php
// Add this to functions.php
function suzuki_chatbot_widget() {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">';
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
    echo '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">';
    echo '<script defer src="https://theirdomain.com/chatbot/widget.js?v=' . date('YmdH') . '"></script>';
}
add_action('wp_footer', 'suzuki_chatbot_widget');
```

**Or the simpler way — plugin "Insert Headers and Footers":**

1. WordPress admin → Plugins → Add New → search "Insert Headers and Footers" → Install → Activate
2. Settings → Insert Headers and Footers → Scripts in Footer → paste:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<script defer src="https://theirdomain.com/chatbot/widget.js?v=1"></script>
```

3. Save → open the WordPress site in incognito → chat bubble should appear.

---

### PHASE 9 — Final Verification Checklist

Run this before you leave:

```bash
# Backend alive
curl https://theirdomain.com/api/health

# Widget serving
curl -I https://theirdomain.com/chatbot/widget.js

# PM2 persists on reboot
pm2 list
pm2 save

# Simulate reboot test
sudo reboot
# wait 60 seconds, SSH back in
pm2 list    # suzuki-backend should be "online" automatically

# Check logs clean
pm2 logs suzuki-backend --lines 30
sudo tail -f /var/log/nginx/error.log
```

From your phone, open the WordPress site and test:
- Chat bubble appears
- Upload carte grise works
- Chat messages work
- Response appears with list of parts

---

## If They Use Apache Instead of Nginx

Replace Phase 7 with this — create `/etc/apache2/conf-available/suzuki-chatbot.conf`:

```apache
# Serve widget files
Alias /chatbot /var/www/suzuki-widget
<Directory /var/www/suzuki-widget>
    Require all granted
    Options -Indexes
</Directory>

# Proxy API to NestJS
ProxyPass /api/ http://localhost:8000/
ProxyPassReverse /api/ http://localhost:8000/
```

```bash
sudo a2enmod proxy proxy_http
sudo a2enconf suzuki-chatbot
sudo systemctl reload apache2
```

---

## Summary: What Gets Deployed Where

| Component | Location on Client Server | How Accessed |
|---|---|---|
| NestJS backend | `/var/www/suzuki-chatbot/suzuki-backend` | `localhost:8000` via PM2 |
| React widget | `/var/www/suzuki-widget/widget.js` | `https://theirdomain.com/chatbot/widget.js` |
| PostgreSQL | `localhost:5432/suzuki_parts` | Internal only |
| Nginx proxy | `/etc/nginx/sites-available/` | Routes `/api/*` → NestJS |
| WordPress | Untouched except one `<script>` tag in footer | Loads widget from their own domain |

Your personal server `5.199.136.2` is completely out of the picture. Everything lives and talks within the client's own server. The WordPress site just loads a script tag — it has no idea there's a React app or NestJS behind it.
## Exactly right — here's the full tomorrow flow simply

---

## If Their Server is Windows VPS

Stop everything and ask them for a **Linux VPS or Ubuntu server** instead. Running NestJS + PostgreSQL + Nginx on Windows Server is painful and unnecessary. If they only have Windows, you install **WSL2** (Windows Subsystem for Linux) and do everything inside it. But push for Linux.

---

## The Full Tomorrow Flow

### Step 1 — Database ✅ (you got this)
```bash
# Install PostgreSQL
sudo apt install postgresql -y

# Create DB
sudo -u postgres psql
CREATE USER suzuki_user WITH PASSWORD 'StrongPass2026!';
CREATE DATABASE suzuki_parts OWNER suzuki_user;
\q

# Import your data dump from your test server
# (dump it from 5.199.136.2 before you go)
pg_restore -U suzuki_user -d suzuki_parts /path/to/dump.dump
```

---

### Step 2 — Backend ✅ (you got this)
```bash
# Copy folder, install, configure .env, build, PM2
cd /var/www/suzuki-chatbot/suzuki-backend
npm install
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 start dist/main.js --name suzuki-backend
pm2 save
```

`.env` on their server:
```env
DATABASE_URL="postgresql://suzuki_user:StrongPass2026!@localhost:5432/suzuki_parts"
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="AIza..."
PORT=8000
NODE_ENV=production
CORS_ORIGINS="https://theirdomain.com,https://www.theirdomain.com"
```

Verify backend alive:
```bash
curl http://localhost:8000/health   # must return OK
```

---

### Step 3 — Frontend Widget ✅ (you got this)

```bash
cd /var/www/suzuki-chatbot/chatboat

# .env with their REAL domain
echo "REACT_APP_API_URL=https://theirdomain.com/api" > .env

# Build
npm run build

# Copy compiled output to Nginx folder
sudo mkdir -p /var/www/suzuki-widget
sudo cp -r dist/* /var/www/suzuki-widget/
```

This produces **one file**: `widget.js`. That's all WordPress needs.

---

### Step 4 — Nginx (the glue between everything)

This is the key step that connects it all:

```nginx
# ADD inside their existing WordPress server{} block
# DO NOT create a new server block

location /chatbot/ {
    alias /var/www/suzuki-widget/;
    try_files $uri $uri/ =404;
}

location /api/ {
    proxy_pass http://localhost:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_read_timeout 300s;
    client_max_body_size 30M;
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

After this:
```
https://theirdomain.com/chatbot/widget.js  → serves your React widget
https://theirdomain.com/api/health         → hits your NestJS backend
```

---

### Step 5 — WordPress (literally 2 minutes)

**Go to WordPress admin dashboard:**

```
Appearance → Theme Editor → functions.php
```

Add at the very bottom:

```php
function suzuki_chatbot() {
    echo '<script defer src="https://theirdomain.com/chatbot/widget.js"></script>';
}
add_action('wp_footer', 'suzuki_chatbot');
```

**OR** if they're scared of editing PHP:

```
Plugins → Add New → search "Insert Headers and Footers" → Install → Activate
Settings → Insert Headers and Footers → Footer box → paste:
```

```html
<script defer src="https://theirdomain.com/chatbot/widget.js"></script>
```

Save. Open their website in incognito. **Chat bubble appears. Done.**

---

## The Mental Model — Memorize This

```
Browser loads WordPress page
    ↓
WordPress footer loads widget.js from /chatbot/
    ↓
Chat bubble appears (pure React, nothing to do with WordPress)
    ↓
User uploads carte grise
    ↓
Widget calls https://theirdomain.com/api/verification/upload
    ↓
Nginx proxies /api/ → localhost:8000 (your NestJS)
    ↓
NestJS talks to PostgreSQL on same server
    ↓
Response goes back to widget
```

WordPress is **just a host for the script tag**. It knows nothing about React, NestJS, or PostgreSQL. They never touch each other.

---

## Do This Tonight Before You Go

Dump your test database so you have the data ready to restore tomorrow:

```bash
# SSH into your test server 5.199.136.2
ssh mohamed@5.199.136.2

# Dump the database
pg_dump -U postgres -d suzuki_parts -F c -f ~/suzuki_prod_final.dump

# Exit and download to your machine
exit
scp mohamed@5.199.136.2:~/suzuki_prod_final.dump ./suzuki_prod_final.dump
```

Put `suzuki_prod_final.dump` in your chatbot folder so you carry it with you tomorrow on a USB or in the folder you'll SCP over.

---

## Tomorrow's Checklist Card (print this)

```
□ 1. SSH into their server
□ 2. Install Node 20, PM2, PostgreSQL (if missing)
□ 3. Upload backend + frontend folders
□ 4. Create DB + restore dump
□ 5. Configure backend .env with their domain
□ 6. npm install + prisma deploy + npm run build (backend)
□ 7. pm2 start + pm2 save + pm2 startup
□ 8. Build frontend with their domain in .env
□ 9. Copy dist/* to /var/www/suzuki-widget/
□ 10. Add 2 location blocks to Nginx config
□ 11. nginx -t + systemctl reload nginx
□ 12. Test: curl https://theirdomain.com/api/health
□ 13. Test: curl -I https://theirdomain.com/chatbot/widget.js
□ 14. Paste <script> tag in WordPress footer
□ 15. Open site in incognito — bubble appears ✅
```