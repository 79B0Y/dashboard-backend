// server.js – 应用入口（逐行注释）

import express from 'express';          // 引入 Express
import http from 'http';                // 原生 HTTP，用于在同一端口挂 WS
import mongoose from 'mongoose';        // 连接 MongoDB
import dotenv from 'dotenv';            // 读取 .env

// 中间件 & 路由 & 服务
import { authMiddleware } from './middlewares/auth.js';
import apiKeyRoutes from './routes/apikey.routes.js';
import configRoutes from './routes/config.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { WebSocketHub } from './services/wsHub.js';
import { logger } from './utils/logger.js';

const app = express();                  // 创建 Express 实例
dotenv.config();                        // ① 解析 .env 到 process.env
app.use(express.json());           // ✅ 加这一行！解析 JSON 请求体
app.use(authMiddleware);                  // 之后才启用全局鉴权

const server = http.createServer(app);  // 用原生 HTTP 包裹，后面挂 WebSocket

// ---------- 路由 ----------
app.use('/api/apikey', apiKeyRoutes);   // ② API‑Key 生成 / 查询
app.use('/api/config', configRoutes);   // ③ 单仪表盘配置、聚合取数
app.use('/api/dashboard', dashboardRoutes); // ④ 多仪表盘 CRUD

// ---------- 中间件 ----------
app.use(express.json());                // 内置 JSON Body Parser
app.use(authMiddleware);                // API‑Key 鉴权（所有 API 统一）

// ---------- 数据库 ----------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ---------- 启动 + WebSocket ----------
mongoose.connection.once('open', () => {
  logger.info('✅ MongoDB connected');

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => logger.info(`🚀 Backend on ${PORT}`));

  // 初始化 WebSocket Hub（共享同一 HTTP 端口）
  WebSocketHub(server);
});

// ---------- 错误处理可选 ----------
app.use((err, _req, res, _next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

/*
📝 关键说明
────────────────────────────────────────
1. dotenv 在最顶部加载，确保下方能读取 process.env.MONGO_URI、PORT 等。
2. 所有 /api/** 路由均在 authMiddleware 之后 → 统一鉴权。
3. WebSocketHub 接管同一个 HTTP server，实现 WS + REST 共端口。
4. Mongoose 连接成功后才真正开启 HTTP 监听，避免访问时 DB 尚未就绪。
*/
