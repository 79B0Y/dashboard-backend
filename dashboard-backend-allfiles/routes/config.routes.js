
import express from 'express';
import { getConfig, updateConfig, aggregateData } from '../controllers/config.controller.js';
const router = express.Router();
router.get('/', getConfig);
router.put('/', updateConfig);
router.post('/agg', aggregateData);
export default router;
