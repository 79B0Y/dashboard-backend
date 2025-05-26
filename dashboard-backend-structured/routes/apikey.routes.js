import express from 'express';
import { createApiKey } from '../controllers/apikey.controller.js';

const router = express.Router();
router.post('/', createApiKey);
export default router;
