import express  from 'express' 
 import { connectedDB } from './db/db.js'
import dotenv from  'dotenv'
dotenv.config()
   
const app =  express() 

 app.use(express.json()) 
 app.get('/', (req, res )=> {
     res.send('API is running')
 })
import authRoute from './routes/authRoute.js'

app.use('/api', authRoute)

const PORT = process.env.PORT || 3000

const start = async () => {
  await connectedDB()
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

start()


