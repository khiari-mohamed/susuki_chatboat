#!/bin/bash
# Phase 2: Setup PostgreSQL Database
# Run this after Phase 1

echo "🗄️  Setting up PostgreSQL database..."

# Create user and database
sudo -u postgres psql << 'EOF'
-- Create user
CREATE USER suzuki_user WITH PASSWORD 'Suzuki2025!SecurePass';

-- Create database
CREATE DATABASE suzuki_parts OWNER suzuki_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE suzuki_parts TO suzuki_user;

-- Connect to the database and grant schema privileges
\c suzuki_parts
GRANT ALL ON SCHEMA public TO suzuki_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO suzuki_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO suzuki_user;

\q
EOF

echo "✅ Database created!"
echo "📌 Database: suzuki_parts"
echo "📌 User: suzuki_user"
echo "📌 Password: Suzuki2025!SecurePass"
echo ""
echo "🔍 Verifying database..."
sudo -u postgres psql -d suzuki_parts -c "\dt"
echo ""
echo "📌 Next: Upload your project folders and run phase 3"
