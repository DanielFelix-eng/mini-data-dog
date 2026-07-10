import express from 'express'
import { getDashBoardStats, getResponseTime, uptimePercentage } from '../controlllers/dashboardcontrooler.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.use(verifyToken)

router.get('/dashboard-stats', getDashBoardStats)
router.get('/response-times', getResponseTime)
router.get('/uptime-percentage', uptimePercentage)

export default router