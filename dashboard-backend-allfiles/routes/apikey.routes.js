// routes/apikey.routes.js – API‑Key 路由
// --------------------------------------------------
// 挂载路径： /api/apikey
// 支持： POST (创建)  &  GET (查询)
// --------------------------------------------------

import express from 'express';
import { createApiKey, getApiKey } from '../controllers/apikey.controller.js';

const router = express.Router();

/**
 * POST /api/apikey
 * Body: { userId }
 * 📌 功能：为指定 userId 生成（或返回已有）API‑Key
 */
router.post('/', createApiKey);

/**
 * GET /api/apikey?userId=xxx
 * 📌 功能：查询 userId 是否已绑定 API‑Key
 */
router.get('/', getApiKey);

export default router;

/*
👀 Tips
─────────────────────────────────────
• 该路由文件不受 authMiddleware 限制（在 server.js 中先 use(auth) 再挂路由时可排除），
  因为创建 / 查询 Key 应允许未认证用户访问。
• 若希望所有用户都必须事先注册，可将此路由也放到鉴权后，并在 authMiddleware 中排除特定路径。
*/
