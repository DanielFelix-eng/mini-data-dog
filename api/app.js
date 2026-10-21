import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/authRoute.js'
import ProjectRoute from './routes/projectRoutes.js'
import MonitorRoute from './routes/monitorRoutes.js'
import DashboardRoute from './routes/dashboardRoute.js'
import LogRoute from './routes/logRoutes.js'
import SettingsRoute from './routes/settingsRoutes.js'
import AnalyticsRoute from './routes/analyticsRoutes.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: process.env.CLIENT_URL || (
    process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173'
  ),
  credentials: true
}))

app.use('/api/auth', authRoute)
app.use('/api', ProjectRoute)
app.use('/api', MonitorRoute)
app.use('/api/dashboard', DashboardRoute)
app.use('/api/logs', LogRoute)
app.use('/api', SettingsRoute)
app.use('/api/analytics', AnalyticsRoute)

app.get('/api/auth/debug/cookies', (req, res) => {
  res.json({ hasTokenCookie: Boolean(req.cookies?.token) })
})

app.get('/', (req, res) => {
  res.send('API is running')
})

export default app
