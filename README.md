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
# 📘 Dashboard 后端接口文档（完整 - Markdown 增强版）

> 🕒 更新时间：2025-05-26

---

## 🌐 接口基础信息

- **服务地址**（开发）：`http://localhost:3001`
- **鉴权方式**：除部分接口外，所有接口都必须携带 API Key：
  - 请求头方式：`X-API-Key: your-key`
  - 或 URL 参数方式：`?key=your-key`

---

## 📑 接口总览

| 接口路径              | 方法 | 描述                        | 鉴权 | 备注                                     |
|------------------------|------|-----------------------------|------|------------------------------------------|
| `/api/apikey`         | POST | 根据用户 ID 创建 API Key     | 否   | 仅首次绑定，无需旧 key                   |
| `/api/apikey`         | GET  | 根据用户 ID 查询 API Key     | 否   | 查询是否已绑定，返回已生成的 key         |
| `/api/config`         | GET  | 获取仪表盘配置               | ✅   | 返回当前配置 JSON                        |
| `/api/config`         | PUT  | 更新仪表盘配置               | ✅   | 更新 layout 内容                         |
| `/api/config/agg`     | POST | 查询指定卡片的数据（聚合）   | ✅   | 聚合查询（collection + pipeline）        |

---

## 🔐 创建 API Key

**接口地址**：`POST /api/apikey`

**请求示例**：
```json
{
  "userId": "user_123"
}
```

**返回（新建）**：
```json
{
  "key": "xxx-xxx-uuid"
}
```

**返回（已存在）**：
```json
{
  "error": "API key already exists for this user",
  "key": "xxx-xxx-existing"
}
```

---

## 🔍 查询 API Key

**接口地址**：`GET /api/apikey?userId=user_123`

- 参数说明：`userId` 为用户唯一 ID

**返回（存在）**：
```json
{
  "key": "xxx-xxx-uuid"
}
```

**返回（未绑定）**：
```json
{
  "error": "API key not found for this user"
}
```

📎 不需要鉴权，前端可用作注册逻辑判断是否已有 key。

---

## 📥 获取仪表盘配置

**接口地址**：`GET /api/config?key=xxx`

**返回示例**：
```json
{
  "userId": "user_123",
  "layout": { "cards": [...] },
  "versions": [...]
}
```

---

## 📤 更新仪表盘配置

**接口地址**：`PUT /api/config?key=xxx`

**请求示例**：
```json
{
  "layout": { "cards": [...] }
}
```

**返回示例**：
```json
{
  "ok": true,
  "config": { ...updated... }
}
```

---

## 📊 聚合查询卡片数据

**接口地址**：`POST /api/config/agg?key=xxx`

**请求示例**：
```json
{
  "collection": "device_stats",
  "pipeline": [
    { "$match": { "device": "abc123" } },
    { "$group": { "_id": null, "total": { "$sum": "$power" } } }
  ]
}
```

**返回示例**：
```json
{
  "value": {
    "total": 285.7
  }
}
```

📎 支持任意聚合逻辑，由前端根据卡片定义动态构造 pipeline。

---

## 📡 WebSocket 推送（可选）

- **连接地址**：`ws://localhost:3001`
- **连接成功后将收到欢迎包**：
```json
{
  "type": "welcome",
  "ts": 1748200000
}
```

📎 未来可推送 `configUpdated` 等事件实现实时热更新。

---

如需扩展功能（如图表聚合服务、用户角色权限、Token 鉴权等），请提前定义字段结构与访问规则，后端可快速适配。

---

如需扩展图表卡片聚合查询、用户注销、权限绑定等功能，请提前定义接口结构和字段范围。

