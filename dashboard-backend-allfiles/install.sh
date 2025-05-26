#!/usr/bin/env bash
# install.sh – Ubuntu 一键安装 & systemd Service 自启动
# ------------------------------------------------------------
# 功能：
#   1. 安装 Node 18（若不存在）
#   2. 安装项目依赖、拷贝 .env
#   3. 生成 systemd 单元文件 dashboard-backend.service
#   4. 重新加载守护 → 启用 & 启动服务
# ------------------------------------------------------------
set -euo pipefail

bold() { echo -e "\033[1m$*\033[0m"; }
SERVICE_NAME=dashboard-backend
UNIT_PATH=/etc/systemd/system/${SERVICE_NAME}.service
APP_DIR=$(pwd)
NODE_BIN=/usr/bin/node

bold "📦 1/4  检查 / 安装 Node.js 18 …"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs build-essential
fi
node -v

bold "📦 2/4  安装依赖并准备 .env …"
npm install --omit=dev
[ -f .env ] || { cp .env.example .env && bold "已复制 .env.example → .env"; }

bold "⚙️  3/4  生成 systemd Unit …"
cat <<EOF | sudo tee $UNIT_PATH > /dev/null
[Unit]
Description=Dashboard Backend Node Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR
EnvironmentFile=$APP_DIR/.env
ExecStart=$NODE_BIN $APP_DIR/server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl restart $SERVICE_NAME

bold "✅ 4/4  完成！使用 'sudo systemctl status $SERVICE_NAME -l' 查看日志。"
