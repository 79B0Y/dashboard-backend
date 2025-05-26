// services/wsHub.js – WebSocket Hub
// ------------------------------------------------------------------
// 责任：
//   • 在同一 HTTP 端口上启动 WebSocketServer
//   • 统一管理客户端连接数组
//   • 提供 broadcast() Helper 供 Controller 调用
//   • 发送欢迎包 + 心跳（可选）
// ------------------------------------------------------------------

import { WebSocketServer } from 'ws';

let wss;                 // 单例保存 WS Server 引用

/**
 * WebSocketHub(server)
 * @param {http.Server} server – 已经启动的 HTTP Server
 */
export const WebSocketHub = server => {
  if (wss) return;       // 防止重复初始化

  wss = new WebSocketServer({ server });  // 复用同一端口

  wss.on('connection', ws => {
    // ① 发送欢迎包
    ws.send(JSON.stringify({ type: 'welcome', ts: Date.now() }));

    // ② 可选心跳逻辑，防止空闲断开
    ws.isAlive = true;
    ws.on('pong', () => (ws.isAlive = true));
  });

  // ③ 心跳定时器 (可关闭)
  const interval = setInterval(() => {
    wss.clients.forEach(client => {
      if (!client.isAlive) return client.terminate();
      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on('close', () => clearInterval(interval));
};

/**
 * broadcast(msg)
 * @param {Object} msg – 将被 JSON.stringify 后发送给所有客户端
 */
export const broadcast = msg => {
  if (!wss) return;
  const data = JSON.stringify(msg);
  wss.clients.forEach(ws => {
    if (ws.readyState === ws.OPEN) ws.send(data);
  });
};

/*
📌 消息类型约定
────────────────────────────────────
- **welcome**        → 连接成功后首包
- **configUpdated**  → PUT /api/config 成功后广播
- **cardUpdated**    → POST /agg 返回后广播（单卡片数据）

前端可根据 `type` 字段 switch 做不同处理。
*/
