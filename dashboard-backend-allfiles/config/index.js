// config/index.js – 统一导出环境变量 & 常量
// --------------------------------------------------------------
// 目的：集中管理配置，避免在各处直接使用 process.env
// --------------------------------------------------------------

import dotenv from 'dotenv';

dotenv.config();  // 读取根目录 .env 文件

export const CONFIG = {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/dashboard',
  port: parseInt(process.env.PORT, 10) || 3001,
  logLevel: process.env.LOG_LEVEL || 'info',
  // 若有其他配置可追加，例如：
  // jwtSecret: process.env.JWT_SECRET || 'changeme',
};

/*
📝 用法示例
───────────────────────────
import { CONFIG } from '../config/index.js';
mongoose.connect(CONFIG.mongoUri)
app.listen(CONFIG.port)
logger.info(`Log level: ${CONFIG.logLevel}`)
*/
