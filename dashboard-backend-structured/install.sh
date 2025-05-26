#!/bin/bash

set -e

echo "📦 安装依赖..."
npm install

if [ ! -f .env ]; then
  echo "⚠️  未检测到 .env 文件，复制默认配置"
  cp .env.example .env
fi

MONGO_PORT=${MONGO_PORT:-27017}
BACKEND_PORT=${PORT:-3001}

if ! docker ps | grep dashboard-mongo >/dev/null; then
  echo "🚀 启动 MongoDB 容器..."
  docker run -d \
    --name dashboard-mongo \
    -p $MONGO_PORT:27017 \
    -v dashboard_mongo_data:/data/db \
    mongo:6
else
  echo "✅ MongoDB 容器已运行"
fi

echo "🧪 检查 MongoDB 是否可连接..."
sleep 3
docker exec dashboard-mongo mongo --eval "db.stats()" || true

echo "🚀 启动后端服务..."
npm start

echo "📄 初始化测试数据（device_stats）..."
docker exec dashboard-mongo mongosh --eval '
use dashboard;
db.device_stats.insertMany([
  { device: "abc123", power: 100 },
  { device: "abc123", power: 185.7 }
])
'


echo "📊 导入多用户测试数据..."
docker cp dashboard_mongo_init.json dashboard-mongo:/init.json
docker exec dashboard-mongo mongosh dashboard --eval '
var data = JSON.parse(cat("/init.json"));
for (let [col, ops] of Object.entries(data)) {
  db.getCollection(col).bulkWrite(ops);
}
'
