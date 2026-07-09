import express from 'express'
import { getDashBoardStats, getResponseTime } from '../controlllers/dashboardcontrooler.js'
const router = express.Router()

router.get('/dashboard-stats', getDashBoardStats)
router.get('/response-times', getResponseTime)
export default router