// routes/dashboard.routes.js – 多仪表盘 CRUD 路由
// -------------------------------------------------------------------
// 挂载路径： /api/dashboard
//   • GET    /list           → listDashboards (简短列表)
//   • GET    /:id            → getDashboard  (详情)
//   • PUT    /:id            → updateDashboard (保存 / 新建)
//   • DELETE /:id            → deleteDashboard (删除)
// -------------------------------------------------------------------

import express from 'express';
import {
  listDashboards,
  getDashboard,
  updateDashboard,
  deleteDashboard
} from '../controllers/dashboard.controller.js';

const router = express.Router();

/**
 * GET /api/dashboard/list
 * 返回当前用户所有仪表盘的概要（dashboardId, name, icon）
 */
router.get('/list', listDashboards);

/**
 * GET /api/dashboard/:id
 * 获取指定 dashboardId 的完整配置（含 cards layout）
 */
router.get('/:id', getDashboard);

/**
 * PUT /api/dashboard/:id
 * 创建或更新仪表盘；若不存在则 upsert
 */
router.put('/:id', updateDashboard);

/**
 * DELETE /api/dashboard/:id
 * 删除仪表盘；如需软删可在 controller 替换为更新 deleted 字段
 */
router.delete('/:id', deleteDashboard);

export default router;

/*
🔖 备注
──────────────────────────────
• 所有操作在 authMiddleware 之后 → 只能操作自己的仪表盘。
• listDashboards 路由单独命名，避免与 :id 冲突。
• 若要支持“新建”接口，也可额外开放 POST /api/dashboard 并随机生成 dashboardId。
*/
