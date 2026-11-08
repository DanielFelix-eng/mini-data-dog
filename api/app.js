import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
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
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const clientDistPath = path.resolve(__dirname, '../client/dist')

const allowedOrigins = (process.env.CLIENT_URL || (
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173'
))
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ''))) {
      return callback(null, true)
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`))
  },
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath))

  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
}

export default app
