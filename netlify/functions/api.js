import serverless from 'serverless-http'
import app from '../../api/app.js'
import { connectedDB } from '../../api/db/db.js'

const expressHandler = serverless(app, {
  basePath: '/.netlify/functions/api'
})

export const handler = async (event, context) => {
  await connectedDB()
  return expressHandler(event, context)
}
