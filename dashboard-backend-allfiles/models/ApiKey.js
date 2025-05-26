// models/ApiKey.js – Mongoose Schema（带注释）
// --------------------------------------------------
// 用途：存储用户与其唯一 API-Key 映射关系
// --------------------------------------------------

import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,        // 一个 userId 只能对应一把 Key
      index: true
    },
    key: {
      type: String,
      required: true,
      unique: true         // Key 亦不可重复
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    // 可扩展字段示例：角色 / 有效期 / 状态
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    expiresAt: {
      type: Date          // 若需要 Key 过期功能
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false      // 不生成 __v
  }
);

export default mongoose.model('ApiKey', apiKeySchema);

/*
📝 说明
───────────────────────────
- **唯一索引**：`userId` 和 `key` 均唯一，双重约束防止重复写入。
- **额外字段**：如需禁用 Key，可将 disabled 设为 true 并在 authMiddleware 校验。
- **过期策略**：若设置 expiresAt，可在中间件里比较 Date.now() > expiresAt。
*/
