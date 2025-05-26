// controllers/dashboard.controller.js – 多仪表盘 CRUD（含注释）
// ---------------------------------------------------------------------
// 路由映射：
//   GET    /api/dashboard/list       → listDashboards
//   GET    /api/dashboard/:id        → getDashboard
//   PUT    /api/dashboard/:id        → updateDashboard (可新增)
//   DELETE /api/dashboard/:id        → deleteDashboard
// ---------------------------------------------------------------------

import mongoose from 'mongoose';
const Dashboards = mongoose.connection.collection('dashboards');

/**
 * GET /api/dashboard/list
 * 返回当前用户的所有仪表盘简要信息（不含卡片详情）
 */
export const listDashboards = async (req, res) => {
  const userId = req.apiKey;
  const list = await Dashboards.find({ userId })
    .project({ _id: 0, dashboardId: 1, name: 1, icon: 1, updatedAt: 1 })
    .sort({ updatedAt: -1 })
    .toArray();
  res.json(list);
};

/**
 * GET /api/dashboard/:id
 * 读取指定仪表盘完整配置（含 layout.cards）
 */
export const getDashboard = async (req, res) => {
  const { id } = req.params;
  const doc = await Dashboards.findOne({ userId: req.apiKey, dashboardId: id }, { projection: { _id: 0 } });
  if (!doc) return res.status(404).json({ error: 'Dashboard not found' });
  res.json(doc);
};

/**
 * PUT /api/dashboard/:id
 * 更新 / 创建仪表盘；若不存在则 upsert
 */
export const updateDashboard = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;              // { name, icon, layout }
  const filter = { userId: req.apiKey, dashboardId: id };
  const update = {
    $set: { ...payload, updatedAt: new Date() },
    $setOnInsert: { createdAt: new Date() }
  };
  const doc = await Dashboards.findOneAndUpdate(filter, update, { upsert: true, returnDocument: 'after' });
  res.json(doc.value);
};

/**
 * DELETE /api/dashboard/:id
 * 永久删除指定仪表盘
 */
export const deleteDashboard = async (req, res) => {
  const { id } = req.params;
  await Dashboards.deleteOne({ userId: req.apiKey, dashboardId: id });
  res.json({ ok: true });
};

/*
📝 设计要点
──────────────────────────────
1. **数据模式** (dashboards 集合)
   {
     userId: 'user_001',
     dashboardId: 'default',
     name: '能耗概览',
     icon: 'https://cdn/icons/…',
     layout: { cards: [...] },
     createdAt, updatedAt
   }
2. **索引建议**
   • { userId: 1, dashboardId: 1 } 唯一索引
3. **权限隔离**
   • 所有操作基于 req.apiKey（中间件注入），确保用户只能操作自己的仪表盘。
4. **性能优化**
   • listDashboards 只返回轻量字段，前端点击后再请求详情，避免过大响应。
5. **软删除**（可选）
   • 若需恢复功能，可新增字段 `deleted: true` 替换 `deleteOne`。
*/
