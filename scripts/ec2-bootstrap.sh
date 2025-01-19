#!/usr/bin/env bash
set -euo pipefail

# Idempotent EC2 server bootstrap script
# Safe to run multiple times

echo "==> Bootstrapping EC2 server..."

# Idempotent: install Node.js if not present
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  echo "  Node.js installed"
else
  echo "  Node.js already installed: $(node -v)"
fi

# Idempotent: install pm2 globally if not present
if ! command -v pm2 &>/dev/null; then
  sudo npm install -g pm2
  pm2 startup
  echo "  pm2 installed"
else
  echo "  pm2 already installed"
fi

# Idempotent: create app directory
mkdir -p /home/ubuntu/ShopSmart

# Idempotent: clone or pull repo
if [ -d /home/ubuntu/ShopSmart/.git ]; then
  cd /home/ubuntu/ShopSmart && git pull origin main
  echo "  Repo updated"
else
  git clone https://github.com/ath1614/ShopSmart /home/ubuntu/ShopSmart
  echo "  Repo cloned"
fi

echo "==> EC2 bootstrap complete!"
