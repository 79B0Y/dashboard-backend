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
## 🧾 Swagger 文档同步建议

建议使用 `swagger-jsdoc` + `swagger-ui-express` 集成 Swagger UI。

### 安装依赖

```bash
npm install swagger-jsdoc swagger-ui-express --save
```

### 添加 Swagger 配置模块

```js
// docs/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dashboard Backend API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'], // 注释写在 routes 文件中
};

export const swaggerSpec = swaggerJSDoc(options);
```

### 在 server.js 中接入

```js
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

### 示例注释（添加至 routes/apikey.routes.js 顶部）

```js
/**
 * @swagger
 * /api/apikey:
 *   post:
 *     summary: 根据用户ID生成 API Key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user_abc123"
 *     responses:
 *       200:
 *         description: 返回生成或已有的 API Key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 key:
 *                   type: string
 *                   example: f0c9b7d2-ae2b-47e3-92fc-ced3bc8e3d2b
 */
```


客户端可监听服务推送的 `configUpdated` 等消息事件（未来扩展）。

---

## 📁 文件说明参考

详见目录结构说明文档 `dashboard-backend-files`

如需生成 Swagger 文档、加入 PM2、Nginx、或 SaaS 模式拓展，欢迎继续请求 🎯
