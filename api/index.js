import express from 'express'
import { connectedDB } from './db/db.js'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './routes/authRoute.js'
import ProjectRoute from './routes/projectRoutes.js'
 
dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
 app.get('/', (req, res )=> {
     res.send('API is running')
 })
  app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : 'http://localhost:5173',
  credentials: true
}))

app.use('/api', authRoute)
app.use('/api', ProjectRoute)

const PORT = process.env.PORT || 3000

const start = async () => {
  await connectedDB()
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

start()


