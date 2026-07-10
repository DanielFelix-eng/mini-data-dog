import express from 'express'
import { getDashBoardStats, getResponseTime  , uptimePercentage } from '../controlllers/dashboardcontrooler.js'
const router = express.Router()

router.get('/dashboard-stats', getDashBoardStats)
router.get('/response-times', getResponseTime) 
router.get('/uptime-percentage',  uptimePercentage) 
export default router