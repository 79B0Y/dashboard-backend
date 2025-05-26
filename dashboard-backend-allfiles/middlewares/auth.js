// middlewares/auth.js – API‑Key 鉴权中间件
// -------------------------------------------------------
// ▶ 使用方式：`app.use(authMiddleware)` → 所有后续路由统一鉴权
// ▶ 逻辑：
//    1. 尝试从请求头 `X-API-Key` 读取 key
//    2. 若不存在，再检查查询参数 `?key=`
//    3. 校验失败返回 401；成功则把 key 作为 userId 注入 `req.apiKey`
// -------------------------------------------------------

export const authMiddleware = (req, res, next) => {
  // ① 支持两种写法：Header 优先，其次 URL 参数
  const key = req.headers['x-api-key'] || req.query.key;

  if (!key) {
    return res.status(401).json({ error: 'API key required' });
  }

  // ② 可在此处验证 key 是否存在于数据库
  //    例如使用 ApiKey.findOne({ key }) → 404 时返回 401
  //    为简化示例，此处直接信任传入 key。

  req.apiKey = key;          // 后续控制器可视为 userId / tenantId
  next();                    // ③ 进入下一中间件 / 路由
};

/*
💡 扩展思路
──────────────────────────────
- 若要做 **权限角色**：可在查库后 `req.user = { id, roles: [...] }`
- 若要做 **速率限制**：可结合 express-rate-limit 按 key 限流。
- 若要做 **过期时间**：在 ApiKey 模型加 `expiresAt` 字段并校验。
*/
