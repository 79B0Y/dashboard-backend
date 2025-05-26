
import express from 'express';
import { listDashboards, getDashboard, updateDashboard, deleteDashboard } from '../controllers/dashboard.controller.js';
const router = express.Router();
router.get('/list', listDashboards);
router.get('/:id', getDashboard);
router.put('/:id', updateDashboard);
router.delete('/:id', deleteDashboard);
export default router;
