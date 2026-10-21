import path from 'node:path'
import { fileURLToPath } from 'node:url'
import app from './app.js'
import { connectedDB } from './db/db.js'
import { startMonitorJob } from './jobs/monitorjobs.js'

const PORT = process.env.PORT || 3000

const start = async () => {
  await connectedDB()
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
  startMonitorJob()
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  start().catch((error) => {
    console.error('Failed to start the API server:', error)
    process.exitCode = 1
  })
}

export { app }