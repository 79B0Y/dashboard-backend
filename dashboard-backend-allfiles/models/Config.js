// models/Config.js – 仪表盘 Layout Schema（含注释）
// ------------------------------------------------------------------
// 负责存储“默认仪表盘”布局（cards 数组）和版本历史
// userId 作为分区键，一位用户一份默认 layout。
// ------------------------------------------------------------------

import mongoose from 'mongoose';

// ⚠️ 卡片结构开放：不同类型字段差异大，用 strict: false
const cardSchema = new mongoose.Schema({}, { strict: false });

const configSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    layout: {
      cards: [cardSchema]  // 数组，每张卡片含 title/type/pipeline/size 等
    },
    versions: [            // 可选：layout 版本快照
      {
        savedAt: { type: Date, default: Date.now },
        layout: Object
      }
    ]
  },
  {
    timestamps: true,      // createdAt & updatedAt 自动维护
    versionKey: false
  }
);

export default mongoose.model('Config', configSchema);

/*
📌 设计说明
──────────────────────────────────────
1. **layout.cards**：前端随时可增删字段 → 用 strict:false 保证灵活。
2. **versions**：PUT /api/config 时，可将旧 layout push 进数组做快照，以便回滚。
3. **索引**：userId 唯一；若需多租户可添加 tenantId 复合索引。
*/
