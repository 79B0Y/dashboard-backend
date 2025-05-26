// controllers/apikey.controller.js – 生成 / 查询 API-Key
// -------------------------------------------------------
// ⚙ 依赖：Mongoose 模型 ApiKey（models/ApiKey.js）
// ⚙ 逻辑：
//   • POST /api/apikey   – createApiKey()
//   • GET  /api/apikey   – getApiKey()
// -------------------------------------------------------

import { v4 as uuidv4 } from 'uuid';    // 生成随机 UUID 作为 API-Key
import ApiKey from '../models/ApiKey.js'; // Mongoose 模型

// POST /api/apikey
export const createApiKey = async (req, res) => {
  const { userId } = req.body;          // 前端提交的用户唯一 ID
  if (!userId)                          // ① 参数校验
    return res.status(400).json({ error: 'userId required' });

  // ② 若已存在则直接返回（幂等）
  const existing = await ApiKey.findOne({ userId });
  if (existing) return res.json({ key: existing.key });

  // ③ 生成新 key 并保存
  const key = uuidv4();
  await ApiKey.create({ userId, key });
  return res.json({ key });
};

// GET /api/apikey?userId=xxx
export const getApiKey = async (req, res) => {
  const { userId } = req.query;
  if (!userId)
    return res.status(400).json({ error: 'userId required' });

  const doc = await ApiKey.findOne({ userId });
  if (!doc)
    return res
      .status(404)
      .json({ error: 'API key not found for this user' });

  res.json({ key: doc.key });
};

/*
📌 设计要点
──────────────────────────────
1. **幂等性**：若用户已存在 key，再次调用 POST 直接返回旧 key，避免重复写入。
2. **无鉴权**：创建 / 查询 API-Key 接口本身无需鉴权，便于注册流程使用。
3. **字段唯一索引**：在 models/ApiKey.js 中 userId 与 key 均设 unique，保证数据一致。
4. **可扩展 metadata**：如需记录过期时间 / 权限角色，可在模型中追加字段 role / expiresAt。
*/
