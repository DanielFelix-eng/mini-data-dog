import serverless from 'serverless-http'
import app from '../../api/app.js'
import { connectedDB } from '../../api/db/db.js'

const expressHandler = serverless(app, {
  basePath: '/.netlify/functions/api'
})

export const handler = async (event, context) => {
  try {
    await connectedDB()
  } catch (error) {
    console.error('API function could not connect to MongoDB', {
      name: error?.name,
      code: error?.code,
    })

    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Database connection unavailable' }),
    }
  }

  return expressHandler(event, context)
}
