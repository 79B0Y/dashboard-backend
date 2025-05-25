# 📘 Dashboard Backend 安装与接口调试说明

更新时间：2025-05-26

---

## 🚀 快速安装部署

### 环境依赖

* Node.js 18+
* Docker (用于运行 MongoDB)

### 一键部署步骤

```bash
# 解压项目压缩包
unzip dashboard-backend-with-install.zip
cd dashboard-backend

# 可选：赋予执行权限
chmod +x install.sh

# 执行安装脚本
./install.sh
```

该脚本将自动执行以下操作：

* 安装 Node 依赖（`npm install`）
* 自动复制 `.env.example` 为 `.env`
* 启动本地 MongoDB 容器（如未运行）
* 启动后端服务（默认端口：3001）

---

## 🔧 手动运行（开发模式）

```bash
# 启动 Mongo 容器
MONGO_PORT=27017 docker run -d \
  --name dashboard-mongo \
  -p 27017:27017 \
  -v dashboard_mongo_data:/data/db \
  mongo:6

# 安装依赖
npm install

# 启动服务
npm start
```

访问接口：`http://localhost:3001`

---

## 🔐 API Key 授权说明

所有 API 请求都必须带上合法的 `API Key`，支持以下两种方式之一：

* 请求头：`X-API-Key: your-api-key`
* URL 参数：`?key=your-api-key`

---

## 📡 REST 接口说明

### 1. 获取当前配置

```http
GET /api/config?key=your-api-key
```

返回示例：

```json
{
  "_id": "...",
  "userId": "your-api-key",
  "layout": {...},
  "versions": [...]
}
```

### 2. 更新配置

```http
PUT /api/config?key=your-api-key
Content-Type: application/json

{
  "layout": { "cards": [...] }
}
```

返回示例：

```json
{
  "ok": true,
  "config": { ... }
}
```

---

## 🌐 WebSocket 接口说明

连接地址：

```
ws://localhost:3001
```

连接成功后将自动收到欢迎信息：

```json
{
  "type": "welcome",
  "ts": 1748199999
}
```

客户端可监听服务推送的 `configUpdated` 等消息事件（未来扩展）。

---

## 📁 文件说明参考

详见目录结构说明文档 `dashboard-backend-files`

如需生成 Swagger 文档、加入 PM2、Nginx、或 SaaS 模式拓展，欢迎继续请求 🎯
