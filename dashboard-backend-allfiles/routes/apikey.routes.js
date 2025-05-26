
import express from 'express';
import { createApiKey, getApiKey } from '../controllers/apikey.controller.js';
const router = express.Router();
router.post('/', createApiKey);
router.get('/', getApiKey);
export default router;
