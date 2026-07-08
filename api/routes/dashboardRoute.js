import express from 'express'
import { getDashBoardStats } from '../controlllers/dashboardcontrooler.js'
const router = express.Router()

router.get('/dashboard-stats', getDashBoardStats)
export default router