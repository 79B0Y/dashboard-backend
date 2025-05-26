// controllers/config.controller.js – 单仪表盘配置 & 数据聚合
// -------------------------------------------------------------------
// 提供：
//   • GET  /api/config           getConfig        → 读取当前用户 layout
//   • PUT  /api/config           updateConfig     → 写入 / 更新 layout
//   • POST /api/config/agg       aggregateData    → 聚合指定卡片数据
//   （聚合完成后通过 WS Hub 推送 cardUpdated）
// -------------------------------------------------------------------

import mongoose from 'mongoose';
import Config from '../models/Config.js';
import { broadcast } from '../services/wsHub.js';

/**
 * GET /api/config
 * 返回当前 API‑Key(=userId) 对应的 layout
 */
export const getConfig = async (req, res) => {
  const userId = req.apiKey;                 // 从鉴权中间件注入
  const cfg = (await Config.findOne({ userId })) || { layout: { cards: [] } };
  res.json(cfg);
};

/**
 * PUT /api/config
 * 保存用户 layout；写入成功后广播 configUpdated
 */
export const updateConfig = async (req, res) => {
  const userId = req.apiKey;
  const updated = await Config.findOneAndUpdate(
    { userId },
    { $set: req.body },
    { upsert: true, new: true }
  );
  // WebSocket 通知前端整体配置变化
  broadcast({ type: 'configUpdated', userId });
  res.json({ ok: true, config: updated });
};

/**
 * POST /api/config/agg
 * { collection, pipeline, cardTitle }
 * 根据卡片定义动态执行聚合，并主动推送 cardUpdated
 */
export const aggregateData = async (req, res) => {
  const { collection, pipeline = [], cardTitle } = req.body;
  if (!collection || !Array.isArray(pipeline))
    return res.status(400).json({ error: 'collection & pipeline required' });

  try {
    const db = mongoose.connection.db;
    const result = await db.collection(collection).aggregate(pipeline).toArray();
    const value = result[0] || {};
    res.json({ value });

    // 实时推送单卡片最新值
    broadcast({
      type: 'cardUpdated',
      userId: req.apiKey,
      cardTitle: cardTitle || 'unknown',
      value
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/*
📓 说明
─────────────────────────────────────
1. **聚合安全**：此实现直接执行前端传来的 pipeline。
   • 若需更严格控制，可增加白名单检查或只读权限。
2. **版本管理**：如要保存历史 layout，可在 updateConfig 时将旧 layout 推入 versions 数组。
3. **广播策略**：
   • configUpdated → 整体 layout 变更
   • cardUpdated   → 单卡片数值更新（减少前端请求）
4. **聚合性能**：复杂管道建议在 Mongo 中加索引 / 采用视图。
*/
