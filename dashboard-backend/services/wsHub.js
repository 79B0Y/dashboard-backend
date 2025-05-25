import { WebSocketServer } from 'ws';

export const WebSocketHub = (server) => {
  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    console.log('WebSocket connected');
    ws.on('message', (msg) => console.log('Received:', msg.toString()));
    ws.send(JSON.stringify({ type: 'welcome', ts: Date.now() }));
  });
};
