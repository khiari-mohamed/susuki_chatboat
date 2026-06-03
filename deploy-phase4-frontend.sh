#!/bin/bash
# Phase 4: Deploy Frontend
# Run this from /home/adm01/suzuki-chatbot/chatboat/

echo "🎨 Deploying React Frontend..."

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')
echo "📡 Server IP: $SERVER_IP"

# Create production .env
cat > .env << EOF
REACT_APP_API_URL=http://${SERVER_IP}:8000
NODE_ENV=production
EOF

echo "✅ .env created"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build production bundle
echo "🏗️  Building React app..."
npm run build

echo ""
echo "✅ Frontend built successfully!"
echo "📁 Build output in: ./dist/"
echo ""
echo "📌 Files created:"
ls -lh dist/

# Install serve globally for serving the widget
sudo npm install -g serve

# Stop existing serve process if any
pm2 delete suzuki-frontend 2>/dev/null || true

# Start frontend with PM2
echo "🚀 Starting frontend with PM2 on port 3000..."
pm2 start "serve -s dist -l 3000" --name suzuki-frontend
pm2 save

echo ""
echo "✅ Frontend deployed!"
echo "📌 Frontend URL: http://${SERVER_IP}:3000"
echo ""
echo "📊 PM2 Status:"
pm2 list
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "🔗 Test URLs:"
echo "   Backend:  http://${SERVER_IP}:8000/health"
echo "   Frontend: http://${SERVER_IP}:3000"
echo ""
echo "📌 Next steps:"
echo "   1. Open http://${SERVER_IP}:3000 in your browser"
echo "   2. Test the chat widget"
echo "   3. Upload a carte grise to test OCR"
echo "   4. In 2 days, we'll integrate with WordPress"
