// server.js – 应用入口（已修复挂载顺序与 req.body 支持）
// ------------------------------------------------------------
// ✅ 支持 ES Module 语法
// ✅ 开放 /api/apikey 接口不鉴权，其它接口统一鉴权
// ✅ 使用 express.json() 解析 POST body
// ------------------------------------------------------------

import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 模块导入
import { authMiddleware } from './middlewares/auth.js';
import apiKeyRoutes from './routes/apikey.routes.js';
import configRoutes from './routes/config.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { WebSocketHub } from './services/wsHub.js';
import { logger } from './utils/logger.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

// ✅ 中间件 – 顺序非常重要
app.use(express.json());                   // 解析 JSON body
app.use('/api/apikey', apiKeyRoutes);      // ① 不鉴权的注册接口
app.use(authMiddleware);                   // ② 之后路由统一要求 API-Key

// ✅ 挂载 API 路由
app.use('/api/config', configRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ 连接数据库
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ✅ 启动服务
mongoose.connection.once('open', () => {
  logger.info('✅ MongoDB connected');
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    logger.info(`🚀 Backend on ${PORT}`);
  });
  WebSocketHub(server);  // 挂载 WS 服务
});

// ✅ 错误处理（可选）
app.use((err, req, res, next) => {
  logger.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});
