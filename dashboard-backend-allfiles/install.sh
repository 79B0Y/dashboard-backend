#!/usr/bin/env bash
# install.sh – 一键安装 & Ubuntu 开机自启脚本
# ------------------------------------------------------------
# 功能：
#   1. 安装 Node 18 & PM2（若系统未安装）
#   2. 安装项目依赖并复制 .env
#   3. 初始化 Mongo（Docker 方式，可注释）
#   4. 使用 PM2 启动服务并注册 systemd 开机自启
# ------------------------------------------------------------
set -euo pipefail

bold() { echo -e "\033[1m$*\033[0m"; }

bold "➡️  Step 1/5  检查 Node 环境 …"
if ! command -v node >/dev/null 2>&1; then
  bold "🔧 未检测到 Node.js，开始安装 Node 18 LTS …"
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs build-essential
else
  node -v
fi

bold "➡️  Step 2/5  安装依赖 …"
npm install --omit=dev

bold "➡️  Step 3/5  准备 .env …"
[ -f .env ] || { cp .env.example .env && bold "已复制 .env.example → .env"; }

bold "➡️  Step 4/5  安装 PM2 并启动服务 …"
sudo npm i -g pm2@latest
pm2 start pm2.config.js --env production
pm2 save

bold "➡️  Step 5/5  配置开机自启 (systemd) …"
PM2_STARTUP_CMD=$(pm2 startup systemd -u "$USER" --hp "$HOME" | tail -n 1)
# shellcheck disable=SC2086
sudo $PM2_STARTUP_CMD

bold "🎉 安装完成！PM2 已托管 dashboard-backend 并随系统自启。"

# 可选：若使用 docker-compose 方式部署 Mongo，请取消以下注释
# bold "🐳 拉起 Mongo Docker 容器 …"
# docker compose up -d mongo
