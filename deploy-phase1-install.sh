#!/bin/bash
# Phase 1: Install Node.js, PM2, PostgreSQL, Nginx
# Run this on Ubuntu 24.04 server

echo "🚀 Starting installation..."

# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js 20.x
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install PostgreSQL
echo "📦 Installing PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

# Install Git (for future updates)
sudo apt install git -y

# Verify installations
echo ""
echo "✅ Verification:"
node -v
npm -v
pm2 -v
psql --version
nginx -v

echo ""
echo "✅ Phase 1 complete! All software installed."
echo "📌 Next: Run phase 2 to create database"
