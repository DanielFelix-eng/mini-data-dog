import express from 'express';
import * as analyticsController from '../controlllers/analyticsController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.use(verifyToken);

router.get('/summary', analyticsController.getAnalyticsSummary);
router.get('/uptime-over-time', analyticsController.getUptimeOverTime);
router.get('/error-rate', analyticsController.getErrorRateAndStatusCodes);
router.get('/incidents', analyticsController.getIncidentTimeline);
router.get('/monitor-comparison', analyticsController.getMonitorComparison);

export default router;