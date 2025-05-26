// utils/logger.js – 轻量日志封装（可替换为 pino / winston）
// ------------------------------------------------------------------
// 目标：提供统一日志接口，后续可无痛切换第三方库。
// ------------------------------------------------------------------

// 当前实现：Node 默认 console → 带时间戳 & Level 标签
const fmt = level => (...args) => {
  const ts = new Date().toISOString();
  console[level](`[${ts}] [${level.toUpperCase()}]`, ...args);
};

export const logger = {
  info: fmt('log'),      // logger.info('Server started')
  warn: fmt('warn'),     // logger.warn('Memory high')
  error: fmt('error')    // logger.error(err)
};

/*
📝 升级建议
───────────────────────────
1. **替换 pino**
   ```js
   import pino from 'pino';
   export const logger = pino({ level: 'info' });
   ```
2. **生产环境文件落盘**：pino 可通过 `pino-http` 或 `pino-pretty` 将日志写文件并统一格式。
3. **集中日志**：容器环境下推荐 stdout → Loki / ELK 收集。
*/
