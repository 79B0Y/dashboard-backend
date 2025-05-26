// routes/config.routes.js – 单仪表盘相关路由
// ------------------------------------------------------------
// 挂载路径： /api/config
// • GET    /api/config          → getConfig
// • PUT    /api/config          → updateConfig
// • POST   /api/config/agg      → aggregateData (动态聚合)
// ------------------------------------------------------------

import express from 'express';
import {
  getConfig,
  updateConfig,
  aggregateData
} from '../controllers/config.controller.js';

const router = express.Router();

/**
 * GET /api/config
 * 返回当前 API-Key (userId) 的 layout 配置
 */
router.get('/', getConfig);

/**
 * PUT /api/config
 * 更新 / 保存 layout.cards；成功后 WS 广播 configUpdated
 */
router.put('/', updateConfig);

/**
 * POST /api/config/agg
 * Body: { collection, pipeline, cardTitle }
 * 执行动态聚合，返回 value，并通过 WS 推送 cardUpdated
 */
router.post('/agg', aggregateData);

export default router;

/*
📌 说明
──────────────────────────────
1. **鉴权**：三条路由均在 authMiddleware 之后挂载 → 需要有效 API-Key。
2. **安全**：aggregateData 接收任意 pipeline，生产环境应结合 allowlist 或字段校验限制注入风险。
*/
