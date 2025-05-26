// pm2.config.js – PM2 进程管理器配置
// ------------------------------------------------------------
// pm2-runtime 会读取此文件，在生产容器中保持进程守护、自动重启。
// 详细文档：https://pm2.keymetrics.io/docs/usage/application-declaration/
// ------------------------------------------------------------

module.exports = {
  apps: [
    {
      name: 'dashboard-backend',   // 进程名称，可通过 `pm2 ls` 查看
      script: 'server.js',         // 启动脚本

      // 📦 环境变量（开发 / 生产可区分）
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },

      // 🌡 资源与稳定性
      instances: 1,               // 可改为 'max' 开启多核 cluster
      autorestart: true,
      watch: false,               // 生产环境不启用文件监视
      max_memory_restart: '300M'  // 内存超过 300M 自动重启
    }
  ]
};

/*
📌 关键字段说明
────────────────────────────────────
• name            – PM2 进程名，影响日志文件名 & 命令别名
• script          – Node 入口文件；也可传 shell/sh 执行
• env / env_production – 多环境变量（`pm2 start pm2.config.js --env production`）
• instances       – 进程数；设置为 `max` 使用 CPU 核心数 cluster 模式
• watch           – 开发可为 true，生产关掉以免触发重启
• max_memory_restart – 内存阈值；超限自动 pm2 restart
*/
