import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { WebSocketHub } from './services/wsHub.js';
import configRoutes from './routes/config.routes.js';
import { authMiddleware } from './middlewares/auth.js';
import { logger } from './utils/logger.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(authMiddleware);
app.use('/api/config', configRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  logger.info('✅ MongoDB connected');
  server.listen(process.env.PORT || 3001, () => {
    logger.info(`🚀 Backend API running on port ${process.env.PORT || 3001}`);
  });
  WebSocketHub(server);
});
