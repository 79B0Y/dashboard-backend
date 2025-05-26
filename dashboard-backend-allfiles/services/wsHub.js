
import { WebSocketServer } from 'ws';
let wss;
export const WebSocketHub = server => {
  wss = new WebSocketServer({ server });
  wss.on('connection', ws => {
    ws.send(JSON.stringify({ type: 'welcome', ts: Date.now() }));
  });
};
export const broadcast = msg => {
  if (!wss) return;
  const data = JSON.stringify(msg);
  wss.clients.forEach(c => c.readyState === 1 && c.send(data));
};
