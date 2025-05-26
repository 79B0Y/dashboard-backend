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

# 📘 Dashboard 后端接口文档（完整）

更新时间：2025-05-26

---

## 🌐 接口基础信息

* 服务地址（开发）：`http://localhost:3001`
* 鉴权方式：**必须附带 API Key（除创建/查询 API Key）**

  * 请求头：`X-API-Key: your-key`
  * 或 URL 参数：`?key=your-key`

---

## 📑 接口总览

| 接口路径          | 方法   | 描述                 | 鉴权 | 备注                 |
| ------------- | ---- | ------------------ | -- | ------------------ |
| `/api/apikey` | POST | 根据用户 ID 创建 API Key | 否  | 仅首次绑定，无需旧 key      |
| `/api/apikey` | GET  | 根据用户 ID 查询 API Key | 否  | 查询是否已绑定，返回已生成的 key |
| `/api/config` | GET  | 获取仪表盘配置            | 是  | 返回当前配置 JSON        |
| `/api/config` | PUT  | 更新仪表盘配置            | 是  | 更新 layout 内容       |

---

## 🔐 创建 API Key

**POST** `/api/apikey`

请求体：

```json
{
  "userId": "user_123"
}
```

返回（新建）：

```json
{
  "key": "xxx-xxx-uuid"
}
```

返回（已存在）：

```json
{
  "error": "API key already exists for this user",
  "key": "xxx-xxx-existing"
}
```

---

## 🔍 查询 API Key

**GET** `/api/apikey?userId=user_123`

请求参数：

* `userId`（字符串）：用户唯一 ID，必填

返回成功：

```json
{
  "key": "xxx-xxx-uuid"
}
```

返回失败：

```json
{
  "error": "API key not found for this user"
}
```

说明：

* 不需要鉴权，可用于前端判断是否已绑定
* 若用户已绑定则返回唯一 API Key

---

## 📥 获取仪表盘配置

**GET** `/api/config?key=xxx`

返回：

```json
{
  "userId": "user_123",
  "layout": { "cards": [...] },
  "versions": [...]
}
```

---

## 📤 更新仪表盘配置

**PUT** `/api/config?key=xxx`

请求体：

```json
{
  "layout": { "cards": [...] }
}
```

返回：

```json
{
  "ok": true,
  "config": { ...updated... }
}
```

---

## 📡 WebSocket 推送（可选）

* 地址：`ws://localhost:3001`
* 无需附带 key，连接后服务将推送：

```json
{
  "type": "welcome",
  "ts": 1748200000
}
```

说明：

* 用于后续支持配置热更新、推送 `configUpdated` 等事件

---

如需扩展图表卡片聚合查询、用户注销、权限绑定等功能，请提前定义接口结构和字段范围。

